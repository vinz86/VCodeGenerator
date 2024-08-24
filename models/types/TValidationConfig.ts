export type TValidationConfig = {
    autoFocus?: boolean,
    extraMessages?: {
        [key: string]: any
    },
    customValidators?:{
        rules: {
            [key: string]: any
        }
    },
    customAsyncValidators?:{
        rules: {
            [key: string]: any
        }
    },
}