import {formComponents, FormComponents} from '@/components/Form/FormComponents';

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
        ...formComponents,
    { name: 'VCGInputText', cat:'PrimeVue', tag: 'InputText', props: {
            ...defaultProps,
        },
    },
];