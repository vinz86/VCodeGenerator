import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';  // Importa l'interfaccia
import { ComponentFlyweight } from "~/factory/FlyweightFactory/ComponentFlyweight";  // Importa la classe flyweight
import type { TFlyweight } from "~/models/types/TFlyweight";  // Importa il tipo
import type { DroppableComponent } from "~/models/DroppableComponent";  // Importa il tipo di componente

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
