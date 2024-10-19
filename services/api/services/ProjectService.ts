import type {TProject} from "~/models/types/TProject";
import type {IProjectService} from "~/services/api/services/interfaces/IProjectService";
import {ApiHttpService} from "~/services/api/core/ApiHttpService";

export class ProjectService extends ApiHttpService implements IProjectService{
    private readonly baseUrl: string

    constructor() {
        super();
        this.baseUrl = 'projects'
    }

    public getProjects(queryParams: Partial<TProject>): Promise<TProject[]> {
        return this.get<TProject[]>(this.baseUrl, queryParams, 5000);
    }

    public getProjectById(id: string): Promise<TProject> {
        return this.get<TProject>(`${this.baseUrl}/${id}`);
    }

    public createProject(project: TProject): Promise<TProject> {
        return this.post<TProject>(this.baseUrl, project);
    }

    public updateProject(id: string, project: Partial<TProject>): Promise<TProject> {
        return this.patch<TProject>(`${this.baseUrl}/${id}`, project);
    }

    public deleteProject(id: string): Promise<void> {
        return this.delete<void>(`${this.baseUrl}/${id}`);
    }

    public count(): Promise<number> {
        return this.get<number>(`${this.baseUrl}/count`);
    }
}
