# rn-auto-scroll-form

A Simple and fully customizable to handle Form in React Native. This library inspired by [Formik](https://github.com/jaredpalmer/formik).


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

```
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
  onSubmit={({isValid, values, firstErrAt}) => console.warn(values)}
  render={({
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
/>
```


## Contributing
Pull requests are always welcome! Feel free to open a new GitHub issue for any changes that can be made.

**Working on your first Pull Request?** You can learn how from this *free* series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

## Author
Egi Wibowo | [egiwibowo13](https://egiwibowo.id)

## License
[MIT](./LICENSE)
