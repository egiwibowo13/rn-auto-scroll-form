import React from 'react';
import {Button, SafeAreaView} from 'react-native';
import * as yup from 'yup';
import {useFormController, ScrollableView, Field} from '../../lib';
import {MyField} from '../components/field';

export const MyUseForm = () => {
  const [initialValues, setInitialValues] = React.useState({
    email: '',
    password: '',
  });

  const schema = yup.object().shape({
    email: yup.string().required().email(),
    password: yup.string().required().min(6),
  });

  const myform = useFormController({
    initialValues,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: ({isValid, values, firstErrAt}) => {
      console.log({isValid, values, firstErrAt});
    },
  });

  return (
    <SafeAreaView>
      <ScrollableView
        ref={myform?.controller}
        contentContainerStyle={{flex: 1}}>
        <Field component={MyField} label="Email" name="email" form={myform} />
        <Field
          component={MyField}
          label="Password"
          name="password"
          form={myform}
        />
        <Button title="Login" onPress={myform?.handleSubmit} />
      </ScrollableView>
    </SafeAreaView>
  );
};
