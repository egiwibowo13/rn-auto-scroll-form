import React from 'react';

function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    String(value).trim() === '' ||
    (Object.keys(value).length === 0 && value.constructor === Object)
  );
}

interface FormContext<T> {
  values: GenericObj<T>;
  errors?: GenericObj<T>;
  handleChange: (txt: string) => void;
  handleBlur: (txt: string) => void;
  handleSubmit: () => void;
}

type GenericObj<T> = {
  [P in keyof T]?: T[P];
};

interface FormProps<T> {
  initialValue: T;
  validationSchema?: any;
  onSubmit: (value: GenericObj<T>) => void;
  children: (context: FormContext<T>) => React.FC<T>;
  render: (context: FormContext<T>) => React.FC<T>;
}

function useForm<T>(
  initialValues: GenericObj<T>,
  validationSchema: any,
  onSubmit: (values: GenericObj<T>) => void,
): FormContext<T> {
  const [values, setValues] = React.useState<GenericObj<T>>(initialValues);
  const [errors, setErrors] = React.useState({});

  const fieldList = Object.keys(initialValues);

  const handleChange = (name: string) => (value: string) => {
    values[name] = value;
    errors[name] = null;
    setValues({...values});
    setErrors({...errors});
  };

  const getFiersError = (errInner = []) => {
    let firstErrAt = null;
    for (let field of fieldList) {
      const isError = errInner.findIndex((e: any) => e.path === field) > -1;
      if (isError) {
        firstErrAt = field;
        break;
      }
    }
    return firstErrAt;
  };

  const handleSubmit = () => {
    if (!isEmpty(validationSchema)) {
      const isValid = validationSchema?.isValidSync(values);
      if (isValid) {
        onSubmit(values);
      } else {
        validationSchema
          ?.validate(values, {abortEarly: false})
          .catch(function (err: any) {
            const firstErrAt = getFiersError(err.inner);
            console.log({firstErrAt});
  
            err.inner.forEach((e: any) => {
              errors[e.path] = e.message;
              setErrors({...errors});
            });
          });
      } 
    } else {
      onSubmit(values);
    }
  };

  const handleBlur = (name: string) => () => {
    if (!isEmpty(validationSchema)) {
      validationSchema?.validateAt(name, values).catch(function (err: any) {
        const nErrors = {...errors, [name]: err.message};
        setErrors(nErrors);
      }); 
    }
  };

  return {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}

const defaultContext: FormContext<any> = {
  values: {},
  errors: {},
  handleChange: () => {},
  handleSubmit: () => {},
  handleBlur: () => {},
};

const FormContext = React.createContext<FormContext<any>>(defaultContext);

const FormProvider = FormContext.Provider;
const FormConsumer = FormContext.Consumer;

export function FormController<T>(params: FormProps<T>) {
  const {values, handleChange, handleSubmit, handleBlur, errors} = useForm(
    params.initialValue,
    params.validationSchema,
    params.onSubmit,
  );
  return (
    <FormProvider
      value={{values, handleChange, handleSubmit, handleBlur, errors}}>
      <FormConsumer>{context => params.render(context)}</FormConsumer>
    </FormProvider>
  );
}
