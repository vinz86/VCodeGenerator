import { ApiBaseRepository } from "~/services/api/ApiBaseRepository";
import type {Project} from "~/models/interfaces/Project";
import type {IProjectRepository} from "~/services/api/interfaces/IProjectRepository";

export class ProjectRepository extends ApiBaseRepository implements IProjectRepository{

    public getProjects(): Promise<Project[]> {
        return this.get<Project[]>('projects');
    }

    public getProjectById(id: string): Promise<Project> {
        return this.get<Project>(`projects/${id}`);
    }

    public createProject(project: Project): Promise<Project> {
        return this.post<Project>('projects', project);
    }

    public updateProject(id: string, project: Partial<Project>): Promise<Project> {
        return this.put<Project>(`projects/${id}`, project);
    }

    public deleteProject(id: string): Promise<void> {
        return this.delete<void>(`projects/${id}`);
    }
}
