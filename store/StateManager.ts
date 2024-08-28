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

  clearState(): void {
    this.state = {} as T;
  }

  clearStateByKey<K extends keyof T>(key: K): void {
    delete this.state[key];
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
// console.log(stateManager.getState('currentProject')); // Output: { name: 'My Project' }
//
// // Clear state by key
// stateManager.clearStateByKey('currentProject');
// console.log(stateManager.getState('currentProject'));
