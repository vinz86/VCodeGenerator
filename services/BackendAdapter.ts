import type { BackendService } from '~/models/interfaces/BackendService';

export class MockBackendService implements BackendService {
  async fetchProjects(): Promise<any[]> {
    // Simula il recupero dei progetti
    return [];
  }

  async saveProject(project: any): Promise<void> {
    // Simula il salvataggio di un progetto
    return Promise.resolve();
  }
}

