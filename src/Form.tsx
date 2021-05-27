import React, { useRef } from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';

function isEmpty(value) {
    return (
        value === null ||
        value === undefined ||
        String(value).trim() === '' ||
        (Object.keys(value).length === 0 && value.constructor === Object)
    );
}

const getPosition = (containerRef, ref, clb) => {
    let result = { top: 0, left:0, width: 0, height: 0 }
    if (ref.current && containerRef.current) {
        ref.current.measureLayout(
            containerRef.current,
            (left, top, width, height) => {
                console.log({left, top, width, height})
                result = { left, top, width, height };
                clb(result);
            },
        );
    } else {
        throw Error('please check your "containerRef" and "ref"');
    }
};

interface FormContext<T> {
    values: GenericObj<T>;
    errors?: GenericObj<T>;
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
    firstErrAt?: string | null
}

interface FormProps<T> {
    initialValue: T;
    validationSchema?: any;
    onSubmit: (params: SubmitParams<T>) => void;
    children: (context: FormContext<T>) => React.FC<T>;
    render: (context: FormContext<T>) => React.FC<T>;
}

type ScrollableViewProps = {
  children: React.ReactNode;
} & ScrollViewProps;

type FormControllerProps<T> = FormProps<T> & ScrollableViewProps;

export const createFormRefs = (initialValue = {}) => {
    let refs = {};
    const fieldList = Object.keys(initialValue);
    for (let index = 0; index < fieldList.length; index += 1) {
        const name = fieldList[index];
        refs[name] = React.createRef();
    }
    return refs;
}

function useForm<T>(
    initialValues: GenericObj<T>,
    validationSchema: any,
    onSubmit: (params: SubmitParams<T>) => void,
): FormContext<T> {
    const [values, setValues] = React.useState<GenericObj<T>>(initialValues);
    const [errors, setErrors] = React.useState({});

    const refsResult = createFormRefs(initialValues);
    const refs = useRef(refsResult);

    const fieldList = Object.keys(initialValues);
    const controller: React.Ref<ScrollableView> = React.createRef();

    const handleChange = (name: string) => (value: string) => {
        values[name] = value;
        errors[name] = null;
        setValues({ ...values });
        setErrors({ ...errors });
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
                onSubmit({isValid, values, firstErrAt: null});
            } else {
                validationSchema
                    ?.validate(values, { abortEarly: false })
                    .catch(function (err: any) {
                        const firstErrAt = getFiersError(err.inner);
                        onSubmit({isValid, values, firstErrAt});
                        controller.current.scrollToView(refs.current[firstErrAt]);
                        err.inner.forEach((e: any) => {
                            errors[e.path] = e.message;
                            setErrors({ ...errors });
                        });
                    });
            }
        } else {
            onSubmit({isValid: true, values, firstErrAt: null});
        }
    };

    const handleBlur = (name: string) => () => {
        if (!isEmpty(validationSchema)) {
            validationSchema?.validateAt(name, values).catch(function (err: any) {
                errors[name] = err.message;
                setErrors(errors);
            });
        }
    };

    return {
        values,
        errors,
        controller,
        handleChange,
        handleBlur,
        handleSubmit,
        refs: refs.current
    };
}

const defaultContext: FormContext<any> = {
    values: {},
    errors: {},
    refs: {},
    controller: { current: null },
    handleChange: () => { },
    handleSubmit: () => { },
    handleBlur: () => { },
};

const FormContext = React.createContext<FormContext<any>>(defaultContext);

const FormProvider = FormContext.Provider;
const FormConsumer = FormContext.Consumer;

class ScrollableView extends React.Component<ScrollableViewProps> {
    private target: React.RefObject<ScrollView> = React.createRef(); // or some other type of Component
    constructor(props: ScrollableViewProps) {
        super(props)
    }

    public  async scrollToView(childRef) {
        getPosition(this.target, childRef, ({left, top, width, height}) => {
            this.target.current.scrollTo({ x: left, y: top, animated: true });
        });
    
    }

    render() {
        const { children } = this.props;
        return <ScrollView ref={this.target}>{children}</ScrollView>;
    }
}

export const FormController = (props: FormControllerProps<any>) => {
    const { values, handleChange, handleSubmit, handleBlur, errors, controller, refs } = useForm(
        props.initialValue,
        props.validationSchema,
        props.onSubmit,
    );

    return (
        <ScrollableView ref={controller}>
            <FormProvider
                value={{ values, handleChange, handleSubmit, handleBlur, errors, controller, refs }}>

                <FormConsumer>{context => props.render(context)}</FormConsumer>
            </FormProvider>
        </ScrollableView>
    )
};

