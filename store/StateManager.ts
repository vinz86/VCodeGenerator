export class StateManager<T extends Record<string, any>> {
  private static instance: StateManager<any>;
  private state: T;

  private constructor() {
    this.state = {} as T;
  }

  static getInstance<T extends Record<string, any>>(): StateManager<T> {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager<T>();
    }
    return StateManager.instance as StateManager<T>;
  }

  setState<K extends keyof T>(key: K, value: T[K]): void {
    this.state[key] = value;
  }

  getState<K extends keyof T>(key: K): T[K] | undefined {
    return this.state[key];
  }
}


// Esempio di utilizzo
// interface AppState {
//   currentProject: { name: string };
//   user: { id: number; name: string };
// }
//
// const stateManager = StateManager.getInstance<AppState>();
// stateManager.setState('currentProject', { name: 'My Project' });
// const project = stateManager.getState('currentProject');
// console.log(project); // Output: { name: 'My Project' }

// Esempio di utilizzo
// const stateManager = StateManager.getInstance();
// stateManager.setState('currentProject', { name: 'My Project' });
