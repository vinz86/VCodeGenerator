import type {Ref} from "vue";

export interface ILoadingManager {
    start(): void;
    stop(): void;
    isLoading(): Ref<boolean>;
}
