import type { IBackendService } from '~/models/interfaces/IBackendService';

export class MockBackendService implements IBackendService {
  async fetchProjects(): Promise<any[]> {
    // Simula il recupero dei progetti
    return [];
  }

  async saveProject(project: any): Promise<void> {
    // Simula il salvataggio di un progetto
    return Promise.resolve();
  }
}

