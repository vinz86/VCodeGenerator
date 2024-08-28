import { BaseRepository } from "~/services/api/repositories/BaseRepository";
import type {Project} from "~/models/interfaces/Project";

export class ProjectRepository extends BaseRepository {
    private static instance: ProjectRepository;

    private constructor() {
        super();
    }

    public static getInstance(): ProjectRepository {
        if (!ProjectRepository.instance) {
            ProjectRepository.instance = new ProjectRepository();
        }
        return ProjectRepository.instance;
    }

    public getProjects(): Promise<Project[]> {
        return this.get<Project[]>('/api/projects');
    }

    public getProjectById(id: string): Promise<Project> {
        return this.get<Project>(`/api/projects/${id}`);
    }

    public createProject(project: Project): Promise<Project> {
        return this.post<Project>('/api/projects', project);
    }

    public updateProject(id: string, project: Partial<Project>): Promise<Project> {
        return this.put<Project>(`/api/projects/${id}`, project);
    }

    public deleteProject(id: string): Promise<void> {
        return this.delete<void>(`/api/projects/${id}`);
    }
}
