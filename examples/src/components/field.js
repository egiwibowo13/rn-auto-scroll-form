import React, {forwardRef} from 'react';
import {TextInput, StyleSheet, Text} from 'react-native';
import PropTypes from 'prop-types';

export const Field = forwardRef((props, ref) => {
  const {style, label, error, ...otherProps} = props;
  return (
    <>
      <Text>{label}</Text>
      <TextInput ref={ref} style={[styles.textInput, style]} {...otherProps} />
      {!!error && <Text style={styles.errText}>{error}</Text>}
    </>
  );
});

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

MyField.propTypes = {
  style: PropTypes.object,
  error: PropTypes.string,
  label: PropTypes.string,
};

MyField.defaultProps = {
  style: {},
  error: '',
  label: '',
};

const styles = StyleSheet.create({
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
