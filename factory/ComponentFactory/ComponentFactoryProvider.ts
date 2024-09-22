import { PrimeVueFactory } from '~/factory/ComponentFactory/UI/PrimeVue/PrimeVueFactory';
import { BootstrapFactory } from '~/factory/ComponentFactory/UI/Bootstrap/BootstrapFactory';
import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import { EComponentTypes } from '~/models/enum/EComponentTypes';
import type {IComponentFactoryProvider} from "~/models/interfaces/IComponentFactoryProvider";

export class ComponentFactoryProvider implements IComponentFactoryProvider {
  private factory: IComponentFactory;

  constructor() {
    this.factory = null;
  }
  getFactory(type: EComponentTypes): IComponentFactory {
    switch (type) {
      case EComponentTypes.Bootstrap:
        this.factory = new BootstrapFactory();
        break;
      case EComponentTypes.PrimeVue:
      default:
        this.factory = new PrimeVueFactory();
    }
    return this.factory;
  }
}