import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import type {ISaveManager} from "~/models/interfaces/ISaveManager";

export class SaveManager<T> implements ISaveManager<T>{
    private autoSaveInterval: number | null = null;
    private saveStatus: Ref<string> = ref('Non Salvato');
    private saveCallback: (data: T[]) => void;
    private debounceTime: number;
    private lastDebounceCall: number = 0;

    constructor(
        saveCallback: (data: T[]) => void,
        debounceTime: number = 1000
    ) {
        this.saveCallback = saveCallback;
        this.debounceTime = debounceTime;
    }

    public startAutoSave(data: Ref<T[]>, interval: number = 5000) {
        this.autoSaveInterval = window.setInterval(() => {
            this.debouncedSave(data.value);
        }, interval);

        watch(
            data,
            () => {
                this.debouncedSave(data.value);
            },
            { deep: true }
        );
    }

    public stopAutoSave() {
        if (this.autoSaveInterval !== null) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    public getSaveStatus(): Ref<string> {
        return this.saveStatus;
    }

    private debouncedSave(data: T[]) {
        const now = Date.now();
        if (now - this.lastDebounceCall >= this.debounceTime) {
            this.lastDebounceCall = now;
            this.save(data);
        }
    }

    private save(data: T[]) {
        try {
            this.saveCallback(data);
            this.saveStatus.value = 'Salvato';
            console.log('Progetto salvato con successo!');
        } catch (error) {
            this.saveStatus.value = 'Errore';
            console.error('Errore nel salvataggio del progetto:', error);
        }
    }s
}
