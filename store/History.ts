import { ref } from 'vue';
import type { DroppableComponent } from '~/models/DroppableComponent';

// Stack per memorizzare gli stati precedenti
const stateHistory = ref<DroppableComponent[][]>([]);

// Stack per memorizzare gli stati successivi
const redoStack = ref<DroppableComponent[][]>([]);

// Memorizza l'ultimo stato
export const saveState = (state: DroppableComponent[]) => {
    // Evita di salvare stati vuoti o duplicati consecutivi
    if (state.length === 0 || (stateHistory.value.length > 0 && JSON.stringify(state) === JSON.stringify(stateHistory.value[stateHistory.value.length - 1]))) {
        return;
    }

    stateHistory.value.push(JSON.parse(JSON.stringify(state)));
    redoStack.value = []; // Pulisco redoStack quando viene salvato un nuovo stato
    console.log("stateHistory.value", stateHistory.value);
};

// Ripristina lo stato precedente
export const undoState = () => {
    if (stateHistory.value.length > 1) { // Mantengo almeno uno stato per evitare di tornare a uno stato vuoto
        const lastState = stateHistory.value.pop();
        if (lastState) {
            redoStack.value.push(JSON.parse(JSON.stringify(lastState)));
            console.log("stateHistory.value dopo undo", stateHistory.value);
            console.log("redoStack.value dopo undo", redoStack.value);
            return stateHistory.value[stateHistory.value.length - 1]; // Restituisco lo stato precedente
        }
    }
    return null;
};

// Ripristina lo stato successivo
export const redoState = () => {
    if (redoStack.value.length > 0) {
        const nextState = redoStack.value.pop();
        if (nextState) {
            stateHistory.value.push(JSON.parse(JSON.stringify(nextState)));
            console.log("stateHistory.value dopo redo", stateHistory.value);
            console.log("redoStack.value dopo redo", redoStack.value);
            return nextState;
        }
    }
    return null;
};
