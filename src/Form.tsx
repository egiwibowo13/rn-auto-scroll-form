import React, {useRef} from 'react';
import {ScrollView, ScrollViewProps} from 'react-native';
import {
  getPosition,
  getFiersError,
  createFormRefs,
  getRequiredFields,
  checkHaveValidation,
  isEmpty,
} from './helper';

interface Count {
  count: number;
  total: number;
}

interface FormContext<T> {
  values: GenericObj<T>;
  errors?: GenericObj<T>;
  count: Count;
  refs?: GenericObj<T>;
  controller: React.Ref<ScrollableView>;
  handleChange: (txt: string) => void;
  handleBlur: (txt: string) => void;
  handleSubmit: (refs: GenericObj<T>) => void;
}

type GenericObj<T> = {
  [P in keyof T]?: T[P];
};

type SubmitParams<T> = {
  isValid: boolean;
  values: GenericObj<T>;
  firstErrAt?: string | null;
};

type UseFormParams<T> = {
  initialValues: GenericObj<T>;
  validationSchema: any;
  onSubmit: (params: SubmitParams<T>) => void;
  countRequiredOnly: boolean;
  validateOnChange: boolean;
  validateOnBlur: boolean;
  enableReinitialize: boolean;
};

type FormProps<T> = {
  children: (context: FormContext<T>) => React.FC<T>;
} & UseFormParams<T>;

type ScrollableViewProps = {
  children: React.ReactNode;
} & ScrollViewProps;

export type FormControllerProps<T> = FormProps<T>;

function useCount(
  validationSchema: any,
  fieldList: string[],
  countRequiredOnly: boolean,
) {
  const allFields = countRequiredOnly
    ? getRequiredFields(validationSchema, fieldList)
    : fieldList;
  const totalCount = allFields?.length;

  const [validFields, setValidField] = React.useState([]);

  const addValidField = fieldName => {
    const validFieldToCounting = allFields.indexOf(fieldName) > -1;
    const dontHasFieldName = validFields.indexOf(fieldName) <= -1;
    if (dontHasFieldName && validFieldToCounting) {
      validFields.push(fieldName);
      setValidField([...validFields]);
    }
  };

  const delValidField = fieldName => {
    const validFieldToCounting = allFields.indexOf(fieldName) > -1;
    const index = validFields.indexOf(fieldName);
    if (index > -1 && validFieldToCounting) {
      validFields.splice(index, 1);
      setValidField([...validFields]);
    }
  };

  return {
    totalCount,
    count: validFields.length,
    addValidField,
    delValidField,
  };
}

export function useFormController<T>(params: UseFormParams<T>): FormContext<T> {
  const {
    initialValues,
    validationSchema,
    onSubmit,
    countRequiredOnly,
    validateOnChange,
    validateOnBlur,
    enableReinitialize,
  } = params;

  const [values, setValues] = React.useState<GenericObj<T>>(initialValues);
  const [errors, setErrors] = React.useState({});

  const refsResult = createFormRefs(initialValues);
  const refs = useRef(refsResult);

  const hasValidation = checkHaveValidation(validationSchema);

  const fieldList = Object.keys(initialValues);
  const controller: React.Ref<ScrollableView> = React.createRef();

  const countProgress = useCount(
    validationSchema,
    fieldList,
    countRequiredOnly,
  );

  const handleChange = (name: string) => (value: string) => {
    if (hasValidation && validateOnChange) {
      try {
        values[name] = value;
        setValues({...values});
        validationSchema?.validateSyncAt(name, values);
        countProgress.addValidField(name);
      } catch (err) {
        countProgress.delValidField(name);
        errors[name] = err.message;
        setErrors({...errors});
      }
    } else {
      values[name] = value;
      errors[name] = null;
      setValues({...values});
      setErrors({...errors});
    }
  };

  const handleSubmit = () => {
    if (hasValidation) {
      try {
        validationSchema?.validateSync(values, {abortEarly: false});
        onSubmit({isValid: true, values, firstErrAt: null});
      } catch (err) {
        const firstErrAt = getFiersError(fieldList, err.inner);
        onSubmit({isValid: false, values, firstErrAt});
        controller.current.scrollToView(refs.current[firstErrAt]);
        err.inner.forEach((e: any) => {
          errors[e.path] = e.message;
          setErrors({...errors});
        });
      }
    } else {
      onSubmit({isValid: true, values, firstErrAt: null});
    }
  };

  const handleBlur = (name: string) => () => {
    if (hasValidation && validateOnBlur && !validateOnChange) {
      try {
        validationSchema?.validateSyncAt(name, values);
        countProgress.addValidField(name);
      } catch (err) {
        countProgress.delValidField(name);
        errors[name] = err.message;
        setErrors({...errors});
      }
    }
  };

  React.useEffect(() => {
    if (enableReinitialize && !isEmpty(initialValues)) {
      setValues({...initialValues});
    }
  }, [enableReinitialize, initialValues]);

  return {
    values,
    errors,
    count: {
      count: countProgress.count,
      total: countProgress.totalCount,
    },
    controller,
    handleChange,
    handleBlur,
    handleSubmit,
    refs: refs.current,
  };
}

const defaultContext: FormContext<any> = {
  values: {},
  errors: {},
  count: {
    count: 0,
    total: 0,
  },
  refs: {},
  controller: {current: null},
  handleChange: () => {},
  handleSubmit: () => {},
  handleBlur: () => {},
};

export const FormContext =
  React.createContext<FormContext<any>>(defaultContext);

const FormProvider = FormContext.Provider;
const FormConsumer = FormContext.Consumer;

class ScrollableView extends React.Component<ScrollableViewProps> {
  private target: React.RefObject<ScrollView> = React.createRef(); // or some other type of Component
  constructor(props: ScrollableViewProps) {
    super(props);
  }

  public async scrollToView(childRef) {
    getPosition(this.target, childRef, ({left, top}) => {
      this.target.current.scrollTo({x: left, y: top, animated: true});
    });
  }

  render() {
    const {children} = this.props;
    return <ScrollView ref={this.target}>{children}</ScrollView>;
  }
}

export const FormController = (props: FormControllerProps<any>) => {
  const form = useFormController({
    initialValues: props.initialValues,
    validationSchema: props.validationSchema,
    onSubmit: props.onSubmit,
    countRequiredOnly: props.countRequiredOnly,
    validateOnChange: props.validateOnChange,
    validateOnBlur: props.validateOnBlur,
    enableReinitialize: props.enableReinitialize,
  });

  const {
    values,
    handleChange,
    handleSubmit,
    handleBlur,
    errors,
    controller,
    refs,
    count,
  } = form;

  return (
    <ScrollableView ref={controller}>
      <FormProvider
        value={{
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          errors,
          controller,
          refs,
          count,
        }}>
        <FormConsumer>{context => props.children(context)}</FormConsumer>
      </FormProvider>
    </ScrollableView>
  );
};

FormController.defaultProps = {
  validateOnChange: false,
  validateOnBlur: true,
  countRequiredOnly: true,
  enableReinitialize: false,
};
