import {TextInputProps} from 'react-native';

type FieldProps = {
    name: string;
    error: string;
} & TextInputProps


export const Field: React.FC<FieldProps>;