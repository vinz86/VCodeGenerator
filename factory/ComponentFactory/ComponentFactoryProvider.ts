import { PrimeVueFactory } from '~/factory/ComponentFactory/UI/PrimeVue/PrimeVueFactory';
import { BootstrapFactory } from '~/factory/ComponentFactory/UI/Bootstrap/BootstrapFactory';
import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import { EComponentTypes } from '~/models/enum/EComponentTypes';
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import type {IDroppableComponent} from "~/models/IDroppableComponent";
import {DIContainer} from "~/DIContainer/DIContainer";
import type {FlyweightFactory} from "~/factory/FlyweightFactory/FlyweightFactory";
import type {IComponentFactoryProvider} from "~/models/interfaces/IComponentFactoryProvider";

export class ComponentFactoryProvider implements IComponentFactoryProvider {
  private factory: IComponentFactory;
  private flyweightFactory: FlyweightFactory;

  constructor() {
    this.flyweightFactory = DIContainer.getService<IFlyweightFactory<Partial<IDroppableComponent>>>(EServiceKeys.FlyweightFactory);
  }
  getFactory(type: EComponentTypes): IComponentFactory {
    switch (type) {
      case EComponentTypes.Bootstrap:
        this.factory = new BootstrapFactory(this.flyweightFactory);
        break;
      case EComponentTypes.PrimeVue:
      default:
        this.factory = new PrimeVueFactory(this.flyweightFactory);
    }
    return this.factory;
  }

}