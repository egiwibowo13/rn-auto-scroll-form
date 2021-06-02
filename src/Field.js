import React from 'react';
import {TextInput, View} from 'react-native';

export const Field = ({
  component: Component = TextInput,
  name,
  form,
  ...props
}) => {
  return (
    <View style={{width: '100%'}} ref={form?.refs[name]}>
      <Component
        value={form?.values[name]}
        error={form?.errors[name]}
        onChangeText={form?.handleChange(name)}
        onBlur={form?.handleBlur(name)}
        {...props}
      />
    </View>
  );
};
