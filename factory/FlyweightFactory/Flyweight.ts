import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import { ComponentFlyweight } from "~/factory/FlyweightFactory/ComponentFlyweight";
import type { TFlyweight } from "~/models/types/TFlyweight";

export class Flyweight<T> {
  private flyweights: TFlyweight<T> = new Map();  // Mappa di flyweight inizializzata vuota

  public getFlyweight(uniqueState: string, initialOptions: T): IFlyweightComponent<T> {
    if (!this.flyweights.has(uniqueState)) {  // Verifica se lo stato unico esiste
      this.flyweights.set(
          uniqueState,
          new ComponentFlyweight<T>(uniqueState, initialOptions)  // Crea e imposta un nuovo flyweight
      );
    }
    return this.flyweights.get(uniqueState) as IFlyweightComponent<T>;  // Restituisce il flyweight, assicurando il tipo
  }
}
