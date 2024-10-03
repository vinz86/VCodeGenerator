import type {Project} from "~/models/interfaces/Project";
import type {IProjectService} from "~/services/api/services/interfaces/IProjectService";
import {ApiHttpService} from "~/services/api/core/ApiHttpService";

export class ProjectService extends ApiHttpService implements IProjectService{
    private readonly baseUrl: string

    constructor() {
        super();
        this.baseUrl = 'projects'
    }

    public getProjects(queryParams: Partial<Project>): Promise<Project[]> {
        return this.get<Project[]>(this.baseUrl, queryParams, 5000);
    }

    public getProjectById(id: string): Promise<Project> {
        return this.get<Project>(`${this.baseUrl}/${id}`);
    }

    public createProject(project: Project): Promise<Project> {
        return this.post<Project>(this.baseUrl, project);
    }

    public updateProject(id: string, project: Partial<Project>): Promise<Project> {
        return this.patch<Project>(`${this.baseUrl}/${id}`, project);
    }

    public deleteProject(id: string): Promise<void> {
        return this.delete<void>(`${this.baseUrl}/${id}`);
    }

    public count(): Promise<number> {
        return this.get<number>(`${this.baseUrl}/count`);
    }
}
