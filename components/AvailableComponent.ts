const defaultProps = { class:'', id:'', style:''}
const defaultAttrs = { }
export const availableComponents = [

    { name: 'DroppableComponent', cat:'Layout', tag: 'div', props: {
            ...defaultProps,
            attrs: {
                ...defaultAttrs
            }
        },
    },
    { label: 'Grid', name: 'DroppableComponent', cat:'PrimeVue', tag: 'div', icon: 'fa-solid fa-table-cells', props: {
            class: 'grid w-full',
            attrs: {
                ...defaultAttrs
            }
        },
    },
    { label: 'Col 6', name: 'DroppableComponent', cat:'PrimeVue', tag: 'div', icon: 'fa-solid fa-grip-lines-vertical',
        props: {
            id: '',
            class: 'col-6',
            attrs: {
                ...defaultAttrs
            },
        },
    },
    { label: 'Grid: Col 6', name: 'DroppableComponent', cat:'PrimeVue', tag: 'div', icon: 'fa-solid fa-table-cells-large',
        props: {
            id: '',
            class: 'grid w-full',
            attrs: {
                ...defaultAttrs
            },
        },
    },
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
    { name: 'TextComponent', cat:'Form', tag: 'span', props: {
            ...defaultProps,
            text: "text",
            attrs: {
                ...defaultAttrs,
            }
        },
    },
    { name: 'VCGInputText', cat:'PrimeVue', tag: 'InputText', props: {
            ...defaultProps,
        },
    },
];