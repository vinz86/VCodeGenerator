const defaultProps = { class:'', id:'', style:''}
const defaultAttrs = { }
export const layoutComponents = [
    { name: 'DroppableComponent', cat:'Layout', tag: 'div', icon: 'fa-solid fa-table', props: {
            ...defaultProps,
            attrs: {
                ...defaultAttrs
            }
        },
    },
    { label: 'Div Full', name: 'DroppableComponent', cat:'Layout', tag: 'div', icon: 'fa-solid fa-table-cells', props: {
            class: 'grid w-full',
            style: 'width: 100% !important;',
            attrs: {
                ...defaultAttrs,
                style: 'width: 100% !important;'
            }
        },
    },
    { name: 'br', cat:'Layout', tag: 'br', props: {
            ...defaultProps,
            attrs: {
                ...defaultAttrs
            }
        },
    }
];