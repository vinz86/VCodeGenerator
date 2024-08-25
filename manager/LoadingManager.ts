import type { ILoadingManager } from '~/models/interfaces/ILoadingManager';
import type {Ref} from "vue";

export class LoadingManager implements ILoadingManager {
    private static instance: LoadingManager;
    private loadingCount: number = 0;
    private isLoadingRef: Ref<boolean> = ref(false);

    private constructor() {}

    public static getInstance(): LoadingManager {
        if (!LoadingManager.instance) {
            LoadingManager.instance = new LoadingManager();
        }
        return LoadingManager.instance;
    }

    public start(): void {
        this.loadingCount++;
        this.updateLoadingState();
    }

    public stop(): void {
        if (this.checkLoading()) {
            this.loadingCount--;
            this.updateLoadingState();
        }
    }

    public isLoading(): Ref<boolean> {
        return this.isLoadingRef;
    }

    private checkLoading(): boolean {
        return this.loadingCount > 0;
    }

    private updateLoadingState(): void {
        if (this.checkLoading()) {
            this.isLoadingRef.value = true;
            console.log('Loading start...');
        } else {
            this.isLoadingRef.value = false;
            this.loadingCount = 0;
            console.log('Loading stop.');
        }
    }
}