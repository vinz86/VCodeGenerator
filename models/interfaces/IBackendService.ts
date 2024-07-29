export interface IBackendService {
  fetchProjects(): Promise<any>;
  saveProject(project: any): Promise<void>;
}
