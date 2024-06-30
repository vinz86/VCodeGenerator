import {formComponents} from '~/components/DraggableComponents/Form/FormComponents';
import {layoutComponents} from "~/components/DraggableComponents/Layout/LayoutComponents";

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

    { name: 'VCGInputText', label:'InputText', cat:'PrimeVue', tag: 'InputText', props: {
            ...defaultProps,
        },
    },

    { name: 'VCGInputNumber', label:'InputNumber', cat:'PrimeVue', tag: 'InputNumber', props: {
            ...defaultProps,
            attrs: {
                placeholder: 'Inserisci un numero...'
            },
        },
    },

    { name: 'VCGSlider', label:'Slider', cat:'PrimeVue', tag: 'Slider', props: {
            ...defaultProps,
        },
    },
];