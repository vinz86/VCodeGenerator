const messages: { [key: string]: any } = {
    string: 'The value must be a string',
    min: (length: number) => `The value must be at least ${length} characters long`,
    max: (length: number) => `The value must be at most ${length} characters long`,
    between: (val: number[]) => `The value must be between ${val.join(' and ')} characters long`,
    number: 'The value must be numeric',
    email: 'The value must be a valid email address',
    url: 'The value must be a valid URL',
    phone: 'The value must be a valid phone number',
    required: 'This field is required',
    image: 'The file must be an image',
    regex: 'The value does not match the required format',
    size: (maxSize: number) => `The file must be smaller than ${maxSize} KB`,
    confirmed: 'The value does not match the confirmation field',
    one_of: 'The value must be one of the allowed values',
    not_one_of: 'The value must not be one of the disallowed values',
    ext: (extensions: string[]) => `The file extension must be one of the following: ${extensions.join(', ')}`,
    integer: 'The value must be an integer',
    is: (comparison: any) => `The value must be equal to ${comparison}`,
    is_not: (comparison: any) => `The value must not be equal to ${comparison}`,
    length: (len: number) => `The length must be ${len}`,
    max_value: (max: number) => `The value must be less than or equal to ${max}`,
    min_value: (min: number) => `The value must be greater than or equal to ${min}`,
    between_values: (val: number[]) => `The value must be between ${val.join(' and ')}`,
    mimes: (types: string[]) => `The file type must be one of the following: ${types.join(', ')}`,
    uniqueUsername: 'The entered username has already been used',
};

export default messages;
