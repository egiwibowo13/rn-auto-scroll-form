/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Button,
  Text,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {FormController, Field} from 'rn-auto-scroll-form';
import {MyField} from '../components/field';
import * as yup from 'yup';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const schema = yup.object().shape({
    name: yup.string().required(),
    noTelp: yup.string().optional(),
    gender: yup.string().optional(),
    birthday: yup.string().required(),
    email: yup.string().email().required(),
    address: yup.string().required(),
    city: yup.string().optional(),
    region: yup.string().optional(),
    collage: yup.string().optional(),
    password: yup.string().min(6).required(),
  });

  function isRequired(field) {
    return schema.fields[field]?.exclusiveTests?.required || false;
  }

  const initialValue = {
    name: '',
    email: '',
    noTelp: '',
    gender: '',
    birthday: '',
    address: '',
    city: '',
    region: '',
    collage: '',
    password: '',
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <FormController
        initialValue={initialValue}
        validationSchema={schema}
        onSubmit={({isValid, values, firstErrAt}) => {
          const a = isRequired('name');
          console.warn({a});
        }}>
        {myform => {
          return (
            <View style={styles.content}>
              <Text style={styles.title}>My Form</Text>
              <Field
                label="Name"
                name="name"
                placeholder="Input your name"
                component={MyField}
                form={myform}
              />
              <Field
                label="Email"
                name="email"
                placeholder="Input your email"
                component={MyField}
                form={myform}
              />
              <Field
                label="No. Telp (optional)"
                name="noTelp"
                placeholder="Input your No. Telp"
                component={MyField}
                form={myform}
              />
              <Field
                label="Gender (optional)"
                name="gender"
                placeholder="Input your Gender"
                component={MyField}
                form={myform}
              />
              <Field
                label="Birthday"
                name="birthday"
                placeholder="Input your Birthday"
                component={MyField}
                form={myform}
              />
              <Field
                label="Address"
                name="address"
                placeholder="Input your address"
                component={MyField}
                form={myform}
              />
              <Field
                label="City (optional)"
                name="city"
                placeholder="Input your city"
                component={MyField}
                form={myform}
              />
              <Field
                label="Region (optional)"
                name="region"
                placeholder="Input your region"
                component={MyField}
                form={myform}
              />
              <Field
                label="Collage (optional)"
                name="collage"
                placeholder="Input your collage"
                component={MyField}
                form={myform}
              />
              <Field
                label="Password"
                name="password"
                placeholder="Input your password"
                component={MyField}
                form={myform}
              />
              <Button onPress={myform.handleSubmit} title="Submit" />
            </View>
          );
        }}
      </FormController>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    paddingHorizontal: 8,
    height: 48,
    borderRadius: 10,
    borderColor: '#bdbdbd',
    borderWidth: 1,
    marginVertical: 4,
    width: '100%',
  },
  errText: {
    width: '100%',
    color: '#FA8E8E',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
});

export default App;
