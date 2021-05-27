# rn-auto-scroll-form

A Simple and fully customizable to handle Form in React Native. This library inspired by [Formik](https://github.com/jaredpalmer/formik).

### Example
![](https://raw.githubusercontent.com/egiwibowo13/rn-auto-scroll-form/main/assets/rn-auto-scroll-form.gif)

You can check Example code in this [link](examples/App.js)
## Installation

If using yarn:

```
yarn add rn-auto-scroll-form
```

If using npm:

```
npm i rn-auto-scroll-form
```

## Usage
#### Basic

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


## Contributing
Pull requests are always welcome! Feel free to open a new GitHub issue for any changes that can be made.

**Working on your first Pull Request?** You can learn how from this *free* series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

## Author
Egi Wibowo | [egiwibowo13](https://egiwibowo.id)

## License
[MIT](./LICENSE)
