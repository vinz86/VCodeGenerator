import type {TProject} from "~/models/interfaces/TProject";

export interface IProjectService {
    getProjects(payload: Partial<TProject>): Promise<TProject[]>;
    getProjectById(id: string): Promise<TProject>;
    createProject(project: TProject): Promise<TProject>;
    updateProject(id: string, project: Partial<TProject>): Promise<TProject>;
    deleteProject(id: string): Promise<void>;
    count(): Promise<number>;
}