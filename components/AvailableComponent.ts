const defaultProps = { class:'', id:'', style:''}
const defaultAttrs = { }
export const availableComponents = [
    { name: 'ButtonComponent', cat:'Form', tag: 'button', props: {
            ...defaultProps,
            text: 'Button',
            type: 'button',
            attrs: {
                ...defaultAttrs,
            }
        },
    },
    { id:2, name: 'InputComponent', cat:'Form', tag: 'input', props: {
            ...defaultProps,
            placeholder: 'Input',
            attrs: {
                type: 'text',
                ...defaultAttrs,
            }
        },
    },
    { id:3, name: 'TextComponent', cat:'Form', tag: 'span', props: {
            ...defaultProps,
            text: "text",
            attrs: {
                ...defaultAttrs,
            }
        },
    },
    { id:4, name: 'VCGInputText', cat:'PrimeVue', tag: 'InputText', props: {
            ...defaultProps,
        },
    },
    { id:5, name: 'DroppableComponent', cat:'Layout', tag: 'div', props: {
            ...defaultProps,
            attrs: {
                ...defaultAttrs
            }
        },
    },
];