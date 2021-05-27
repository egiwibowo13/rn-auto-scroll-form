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
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {FormController, Field} from 'rn-auto-scroll-form';
import {MyField} from './src/components/field';
import * as yup from 'yup';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  });

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <FormController
        initialValue={{email: '', password: ''}}
        validationSchema={schema}
        onSubmit={({isValid, values, firstErrAt}) =>
          console.warn({isValid, values, firstErrAt})
        }>
        {({handleSubmit}) => {
          return (
            <View style={styles.content}>
              <Field
                label="Email"
                name="email"
                style={styles.textInput}
                placeholder="Email"
                component={MyField}
              />
              <View style={{height: 1000, width: '100%'}} />
              <Field
                label="Password"
                name="password"
                style={styles.textInput}
                placeholder="Password"
                component={MyField}
              />
              <View style={{height: 1000, width: '100%'}} />
              <Button onPress={handleSubmit} title="Submit" />
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
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
