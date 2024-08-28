import type {Project} from "~/models/interfaces/Project";

export interface IProjectRepository {
    getProjects(): Promise<Project[]>;
    getProjectById(id: string): Promise<Project>;
    createProject(project: Project): Promise<Project>;
    updateProject(id: string, project: Partial<Project>): Promise<Project>;
    deleteProject(id: string): Promise<void>;
}