import {formComponents} from '@/components/Form/FormComponents';
import {layoutComponents} from "~/components/Layout/LayoutComponents";

const defaultProps = { class:'', id:'', style:''}
const defaultAttrs = { }
export const availableComponents = [

    ...layoutComponents, // LAYOUT
    ...formComponents, // FORM

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

    { name: 'VCGInputText', cat:'PrimeVue', tag: 'InputText', props: {
            ...defaultProps,
        },
    },
];