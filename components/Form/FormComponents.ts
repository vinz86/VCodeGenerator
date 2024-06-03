const defaultProps = { class:'', id:'', style:''}
const defaultAttrs = { }
export const formComponents = [

    { name: 'ButtonComponent', cat:'Form', tag: 'button', props: {
            ...defaultProps,
            text: 'Button',
            type: 'button',
            attrs: {
                ...defaultAttrs,
            }
        },
    },
    { name: 'InputComponent', cat:'Form', tag: 'input', props: {
            ...defaultProps,
            placeholder: 'Input',
            attrs: {
                type: 'text',
                ...defaultAttrs,
            }
        },
    },
    { name: 'LabelComponent', cat:'Form', tag: 'span', props: {
            ...defaultProps,
            text: "text",
            attrs: {
                ...defaultAttrs,
            }
        },
    },
];