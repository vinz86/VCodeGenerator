import type { TProjectState } from "~/models/types/TProjectState";
import type { IProjectStateService } from "~/services/api/services/interfaces/IProjectStateService";
import { ApiHttpService } from "~/services/api/core/ApiHttpService";

export class ProjectStateService extends ApiHttpService implements IProjectStateService {
    constructor() {
        super();
        this.baseUrl = 'project-states';
    }

    public getProjectStates(queryParams: Record<string, any>): Promise<TProjectState[]> {
        return this.get<TProjectState[]>(this.baseUrl, queryParams);
    }

    public getProjectStateById(id: string): Promise<TProjectState> {
        return this.get<TProjectState>(`${this.baseUrl}/${id}`);
    }

    public createProjectState(data: TProjectState): Promise<TProjectState> {
        return this.post<TProjectState>(this.baseUrl, data);
    }

    public updateProjectState(id: string, data: Partial<TProjectState>): Promise<TProjectState> {
        return this.patch<TProjectState>(`${this.baseUrl}/${id}`, data);
    }

    public deleteProjectState(id: string): Promise<void> {
        return this.delete<void>(`${this.baseUrl}/${id}`);
    }
}
