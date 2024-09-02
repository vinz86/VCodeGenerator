import { ref, type Ref } from 'vue';
import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";

export default class HistoryManager {
    private stateHistory: Ref<IComponentFactory[][]>;
    private redoStack: Ref<IComponentFactory[][]>;

    constructor() {
        this.stateHistory = ref<IComponentFactory[][]>([]);
        this.redoStack = ref<IComponentFactory[][]>([]);
    }

    // Memorizza l'ultimo stato
    public saveState(state: IComponentFactory[]): void {
        // Evita di salvare stati vuoti o duplicati consecutivi
        if (state.length === 0 || (this.stateHistory.value.length > 0 && JSON.stringify(state) === JSON.stringify(this.stateHistory.value[this.stateHistory.value.length - 1]))) {
            return;
        }

        this.stateHistory.value.push(JSON.parse(JSON.stringify(state)));
        this.redoStack.value = []; // Pulisco redoStack quando viene salvato un nuovo stato
        //console.log("stateHistory.value", this.stateHistory.value);
    }

    // Ripristina lo stato precedente
    public undoState(): IComponentFactory[] | null {
        if (this.stateHistory.value.length > 1) { // Mantengo almeno uno stato per evitare di tornare a uno stato vuoto
            const lastState = this.stateHistory.value.pop();
            if (lastState) {
                this.redoStack.value.push(JSON.parse(JSON.stringify(lastState)));
                //console.log("stateHistory.value dopo undo", this.stateHistory.value);
                //console.log("redoStack.value dopo undo", this.redoStack.value);
                return this.stateHistory.value[this.stateHistory.value.length - 1]; // Restituisco lo stato precedente
            }
        }
        return null;
    }

    // Ripristina lo stato successivo
    public redoState(): IComponentFactory[] | null {
        if (this.redoStack.value.length > 0) {
            const nextState = this.redoStack.value.pop();
            if (nextState) {
                this.stateHistory.value.push(JSON.parse(JSON.stringify(nextState)));
                //console.log("stateHistory.value dopo redo", this.stateHistory.value);
                //console.log("redoStack.value dopo redo", this.redoStack.value);
                return nextState;
            }
        }
        return null;
    }
}

