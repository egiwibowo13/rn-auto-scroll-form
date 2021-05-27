import React, { useContext } from 'react';
import { TextInput, View } from 'react-native';
import { FormContext } from './Form';

export const Field = ({ component: Component = TextInput, name, ...props }) => {
    const ctx = useContext(FormContext);
    return (
        <View style={{ width: '100%' }} ref={ctx?.refs[name]}>
            <Component
                value={ctx?.values[name]}
                error={ctx?.errors[name]}
                onChangeText={ctx?.handleChange(name)}
                onBlur={ctx.handleBlur(name)}
                {...props}
            />
        </View>
    )
}