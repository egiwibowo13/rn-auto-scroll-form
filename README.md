# rn-auto-scroll-form

A Simple and fully customizable to handle Form in React Native. This library inspired by [Formik](https://github.com/jaredpalmer/formik).

### Example
![](https://raw.githubusercontent.com/egiwibowo13/rn-auto-scroll-form/main/assets/rn-auto-scroll-form.gif)

You can check Example code in this [link](examples/App.js)

## Features
- Auto scroll to first error field
- Manage, track state & values of fields
- Supports validations using [yup](https://www.npmjs.com/package/yup)
- Supports custom components

## Getting Started

- [Installation](#installation)
- [Usage](#usage)
  + [Basic Usage](#basic-usage)
  + [Function useFormController](#function-useformcontroller)
  + [Custom Component](#custom-component)
  + [Create Custom Wrapper Component](#create-custom-wrapper-component)
- [API Reference](#properties)
  + [FormController](#formcontroller)
  + [useFormController](#useformcontroller)
  + [FormContext](#formcontroller)
  + [Field](#field)
- [Example](#example)

## Installation
you can install using npm:

```
npm i rn-auto-scroll-form
```

## Usage
#### Basic Usage

```javascript
import { FormController } from 'rn-auto-scroll-form';
```

create validation using [yup](https://www.npmjs.com/package/yup)

```javascript
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  });
```

```javascript
<FormController
  initialValue={{email: '', password: ''}}
  validationSchema={schema}
  onSubmit={({isValid, values, firstErrAt}) => console.warn(values)}>
{({
  values,
  errors,
  refs,
  handleChange,
  handleBlur,
  handleSubmit,
  }) => {
    return (
      <View style={styles.content}>
        <TextInput
          ref={refs?.email}
          style={styles.textInput}
          placeholder="Email"
          onChangeText={handleChange('email')}
          onBlur={handleBlur('email')}
          value={values?.email}
        />
        {!!errors.email && <Text>{errors.email}</Text>}
        <TextInput
          ref={refs?.password}
          style={styles.textInput}
          placeholder="Password"
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          value={values?.password}
        />
        {!!errors.password && <Text style={styles.errText}>{errors.password}</Text>}
        <Button onPress={handleSubmit} title="Submit" />
      </View>
    );
  }}
</FormController>
```


#### Function useFormController

```javascript
import { useFormController, ScrollableView, Field } from 'rn-auto-scroll-form';
```

```javascript
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  });

  const myform = useFormController({
    initialValues: initialValue,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: ({isValid, values, firstErrAt}) => {
      console.log({isValid, values, firstErrAt});
    },
  });
```

```javascript
<ScrollableView ref={myform?.controller}>
  <View style={styles.content}>
    <Text
      style={
        styles.title
      }>{`${myform?.count?.count}/${myform?.count?.total}`}</Text>
    <Field component={MyField} label="Email" name="email" form={myform} />
    <Field component={MyField} label="Password" name="password" form={myform} />

    ...

    <Button onPress={myform.handleSubmit} title="Submit" />
  </View>
</ScrollableView>
```

#### Custom Component
this is example of custom component, make sure your custom component have props `onChangeText` `onBlur` `value` `error (optional)`

```javascript
export const MyField = props => {
  const {style, error, label, ...otherProps} = props;
  return (
    <>
      <Text>{label}</Text>
      <TextInput style={[styles.textInput, style]} {...otherProps} />
      {!!error && <Text style={styles.errText}>{error}</Text>}
    </>
  );
};
```

```javascript
import { FormController, Field } from 'rn-auto-scroll-form';
```

you dont need to handle onChangeText, etc anymore. that is handle at Field Wrapper Component

```javascript
<FormController
  initialValue={{email: '', password: ''}}
  validationSchema={schema}
  onSubmit={({isValid, values, firstErrAt}) => console.warn(values)}>
{({
  handleSubmit,
  }) => {
    return (
      <View style={styles.content}>
        <Field
          label="Email"
          placeholder="Input your email"
          name="name"
          component={MyField}
        />
        <Field
          label="Password"
          placeholder="Input your password"
          component={MyField}
        />
        <Button onPress={handleSubmit} title="Submit" />
      </View>
    );
  }}
</FormController>
```

#### Create Custom Wrapper Component
you can create wrapper component for your component that dont have props `onChangeText` `onBlur` `value`.

in this example you need to get all data with `useContext(FormContext)` and mapping to your custom component `value` `errText` `onChangeValue`.

make sure your custom component have props `name` or whatever your naming that prop (to handle getting specific data)

```javascript
import { FormContext } from 'rn-auto-scroll-form';

export const YourWrapField = ({ component: Component, name, ...props }) => {
    const ctx = useContext(FormContext);
    return (
        <View style={{ width: '100%' }} ref={ctx?.refs[name]}>
            <Component
                value={ctx?.values[name]}
                errText={ctx?.errors[name]}
                onChangeValue={ctx?.handleChange(name)}
                {...props}
            />
        </View>
    )
}
```


### API Reference
### FormController
Props

| Property | Required | Type | Default |
| :------------ |:---------------:| :---------------:| :-----|
| children | `yes` | `((context: FormContext) => React.ReactNode)` | - |
| initialValues | `yes` | `Values` | - |
| validationSchema | `No` | `Schema | (() => Schema)` | `null` |
| validateOnBlur | `No` | `bool` | `true` |
| validateOnChange | `No` | `bool` | `false` |
| enableReinitialize | `No` | `bool` |  `false` |
| countRequiredOnly | `No` | `bool` | `true` |
| autoscroll | `No` | `bool` | `true` |
| countingFields | `No` | `Array[String]` | `null` |

### useFormController
Params when using useFormController
```javascript
type UseFormParams<T> = {
  initialValues: T;
  validationSchema: any;
  onSubmit: (params: SubmitParams<T>) => void;
  countRequiredOnly?: boolean;
  countingFields?: string[];
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  enableReinitialize?: boolean;
  autoscroll?: boolean;
};
```
params `onSubmit`

```javascript
type SubmitParams<T> = {
  isValid: boolean;
  values: GenericObj<T>;
  firstErrAt?: string | null;
};
```

### FormContext
Form Context
```javascript
interface FormContext<T> {
  values: T;
  errors?: T;
  count: Count;
  refs?: T;
  controller: React.Ref<ScrollableView>;
  handleChange: (txt: string) => void;
  handleBlur: (txt: string) => void;
  handleSubmit: (refs: T) => void;
}

interface Count {
  count: number;
  total: number;
}
```

### Field
you can use TextInputProps at Field Component

| Property | Required | Type |
| :------------ |:---------------:| :---------------:|
| name | `yes` | `string` |



## Contributing
Pull requests are always welcome! Feel free to open a new GitHub issue for any changes that can be made.

**Working on your first Pull Request?** You can learn how from this *free* series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

## Author
Egi Wibowo | [egiwibowo13](https://egiwibowo.id)

## License
[MIT](./LICENSE)
