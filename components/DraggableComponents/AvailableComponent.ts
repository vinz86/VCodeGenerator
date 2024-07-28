import {formComponents} from '~/components/DraggableComponents/Form/FormComponents';
import {layoutComponents} from "~/components/DraggableComponents/Layout/LayoutComponents";

const defaultAttributes = { class:'', id:'', style:''}

export const availableComponents = [

    ...layoutComponents, // LAYOUT
    ...formComponents, // FORM
/*
    { label: 'Grid', name: 'DroppableComponent', cat:'PrimeVue', tag: 'div', icon: 'fa-solid fa-table-cells',
        class: 'grid w-full',
        attributes: {
            ...defaultAttributes
        }

    },
    { label: 'Col 6', name: 'DroppableComponent', cat:'PrimeVue', tag: 'div', icon: 'fa-solid fa-grip-lines-vertical',
        props: {
            id: '',
            class: 'col-6',
            attributes: {
                ...defaultAttributes
            },
        },
    },

    { name: 'VCGInputText', label:'InputText', cat:'PrimeVue', tag: 'InputText', props: {
            ...defaultAttributes,
        },
    },

    { name: 'VCGInputNumber', label:'InputNumber', cat:'PrimeVue', tag: 'InputNumber', props: {
            ...defaultAttributes,
            attributes: {
                placeholder: 'Inserisci un numero...'
            },
        },
    },

    { name: 'VCGSlider', label:'Slider', cat:'PrimeVue', tag: 'Slider', props: {
            ...defaultAttributes,
        },
    },*/
];