export class StateManager {
  private static instance: StateManager;
  private state: Record<string, any> = {};

  private constructor() {}

  static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  setState(key: string, value: any): void {
    this.state[key] = value;
  }

  getState(key: string): any {
    return this.state[key];
  }
}

// Esempio di utilizzo
// const stateManager = StateManager.getInstance();
// stateManager.setState('currentProject', { name: 'My Project' });
