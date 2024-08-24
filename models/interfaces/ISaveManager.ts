import type { Ref } from 'vue';

export interface ISaveManager<T> {
    startAutoSave(data: Ref<T[]>, interval?: number): void;
    stopAutoSave(): void;
    getSaveStatus(): Ref<string>;
}
