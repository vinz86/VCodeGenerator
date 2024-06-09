import { ref } from 'vue';
import type {DroppableComponent} from "~/components/models/DroppableComponent";

// Stack per memorizzare gli stati precedenti
const stateHistory = ref<DroppableComponent[][]>([]);

// Memorizza l'ultimo stato
export const saveState = (state: DroppableComponent[]) => {
    stateHistory.value.push(JSON.parse(JSON.stringify(state)));
    console.log("stateHistory.value", stateHistory.value);
};

// Ripristina lo stato precedente
export const undoState = () => {
    if (stateHistory.value.length > 0) {
        return stateHistory.value.pop();
    }
    return null;
};