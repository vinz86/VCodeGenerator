const defaultProps = { class:'', id:'', style:''}
const defaultAttrs = { }
export const layoutComponents = [
    { name: 'DroppableComponent', cat:'Layout', tag: 'div', props: {
            ...defaultProps,
            attrs: {
                ...defaultAttrs
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