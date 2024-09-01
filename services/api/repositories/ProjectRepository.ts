import { ApiBaseRepository } from "~/services/api/ApiBaseRepository";
import type {Project} from "~/models/interfaces/Project";
import type {IProjectRepository} from "~/services/api/interfaces/IProjectRepository";

export class ProjectRepository extends ApiBaseRepository implements IProjectRepository{
    private readonly baseUrl: string

    constructor() {
        super();
        this.baseUrl = 'projects'
    }

    public getProjects(): Promise<Project[]> {
        return this.get<Project[]>(this.baseUrl);
    }

    public getProjectById(id: string): Promise<Project> {
        return this.get<Project>(`${this.baseUrl}/${id}`);
    }

    public createProject(project: Project): Promise<Project> {
        return this.post<Project>(this.baseUrl, project);
    }

    public updateProject(id: string, project: Partial<Project>): Promise<Project> {
        return this.put<Project>(`${this.baseUrl}/${id}`, project);
    }

    public deleteProject(id: string): Promise<void> {
        return this.delete<void>(`${this.baseUrl}/${id}`);
    }
}
