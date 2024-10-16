import type {TProjectState} from "~/models/types/TProjectState";

export interface IProjectStateService {
    getProjectStates(queryParams: Record<string, any>): Promise<TProjectState[]>;
    getProjectStateById(id: string): Promise<TProjectState>;
    createProjectState(data: TProjectState): Promise<TProjectState>;
    updateProjectState(id: string, data: Partial<TProjectState>): Promise<TProjectState>;
    deleteProjectState(id: string): Promise<void>;
}
