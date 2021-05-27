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
  View,
  TextInput,
  Button,
  Text,
} from 'react-native';

import {FormController} from 'rn-auto-scroll-form';
import * as yup from 'yup';

const App = () => {
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
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
              {!!errors.email && (
                <Text style={styles.errText}>{errors.email}</Text>
              )}
              <TextInput
                ref={refs?.password}
                style={styles.textInput}
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values?.password}
              />
              {!!errors.password && (
                <Text style={styles.errText}>{errors.password}</Text>
              )}
              <Button onPress={handleSubmit} title="Submit" />
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
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
});

export default App;
