import {formComponents} from '~/components/DraggableComponents/FormComponents';
import {layoutComponents} from "~/components/DraggableComponents/LayoutComponents";
import {genericComponents} from "~/components/DraggableComponents/GenericComponents";

export const availableComponents = [
    ...genericComponents, // GENERIC
    ...layoutComponents, // LAYOUT
    ...formComponents, // FORM
];