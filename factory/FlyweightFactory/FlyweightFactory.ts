import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import { ComponentFlyweight } from "~/factory/FlyweightFactory/ComponentFlyweight";

export class FlyweightFactory<T> {
  private flyweights: Map<string, IFlyweightComponent<T>> = new Map();

  public getFlyweight(uniqueState: string, initialOptions: T): IFlyweightComponent<T> {
    if (!this.flyweights.has(uniqueState)) {
      this.flyweights.set(
          uniqueState,
          new ComponentFlyweight<T>(uniqueState, initialOptions)
      );
    }
    return this.flyweights.get(uniqueState) as IFlyweightComponent<T>;
  }
}