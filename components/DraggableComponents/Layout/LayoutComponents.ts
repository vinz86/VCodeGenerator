const defaultProps = { class:'', id:'', style:''}
const defaultAttrs = { }
export const layoutComponents = [
    { label: 'container', name: 'DroppableComponent', cat:'Layout', tag: 'div', icon: 'fa-solid fa-square', props: {
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
    { name: 'hr', cat:'Layout', tag: 'hr', props: {
            ...defaultProps,
            attrs: {
                ...defaultAttrs
            }
        },
    }
];