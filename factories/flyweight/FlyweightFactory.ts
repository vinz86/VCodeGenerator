import type { Flyweight } from '~/models/interfaces/Flyweight';
import {ComponentFlyweight} from "~/factories/flyweight/ComponentFlyweight";

export class FlyweightFactory<T> {
  private flyweights: Map<string, Flyweight<T>> = new Map();

  getFlyweight(uniqueState: string, initialOptions: T): Flyweight<T> {
    if (!this.flyweights.has(uniqueState)) {
      this.flyweights.set(
          uniqueState,
          new ComponentFlyweight<T>(uniqueState, initialOptions)
      );
    }
    return this.flyweights.get(uniqueState);
  }
}