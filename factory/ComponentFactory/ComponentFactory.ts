import { PrimeVueFactory } from '~/factory/ComponentFactory/UI/PrimeVue/PrimeVueFactory';
import { BootstrapFactory } from '~/factory/ComponentFactory/UI/Bootstrap/BootstrapFactory';
import type { ComponentFactory } from '~/models/interfaces/ComponentFactory';
import {EComponentTypes} from "~/models/enum/EComponentTypes";
import {HtmlElementsFactory} from "~/factory/ComponentFactory/UI/HtmlElements/HtmlElementsFactory";

export class ComponentFactoryProvider {
  constructor() {
    console.log('ComponentFactory inizializzato');
  }

  getFactory(type: EComponentTypes): ComponentFactory {
    switch (type) {
      case EComponentTypes.PrimeVue:
        return new PrimeVueFactory();
      case EComponentTypes.Bootstrap:
        return new BootstrapFactory();
      case EComponentTypes.HtmlElements:
        return new HtmlElementsFactory();
      default:
        throw new Error('Component Factory non valido');
    }
  }
}