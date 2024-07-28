export interface BackendService {
  fetchProjects(): Promise<any>;
  saveProject(project: any): Promise<void>;
}
