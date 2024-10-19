import { defineStore } from 'pinia'
import type {IAppState} from "~/models/interfaces/IAppState";
import type {TProject} from "~/models/types/TProject";

export const useAppStore = defineStore('useAppStore', {
    state: (): IAppState => ({
        selectedProject: -1,
        selectedFile: -1,
        selectedComponent: -1
    }),
    getters: {
        getProject () { return this.selectedProject },
        getFile() { return this.selectedFile },
        getComponent () { return this.selectedComponent },
        getState() { return this }
    },
    actions: {
        setState(newState): void {
            this.selectedProject = newState.selectedProject || this.selectedProject;
            this.selectedFile = newState.selectedFile || this.selectedFile;
            this.selectedComponent = newState.selectedComponent || this.selectedComponent;
        },

        setProject(project: TProject): void {
            this.selectedProject = project;
        },
        setFile(project: TProject): void {
            this.selectedFile = project;
        },
        setComponent(project: TProject): void {
            this.selectedComponent = project;
        },
    },
})