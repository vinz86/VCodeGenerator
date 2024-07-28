import { PrimeVueFactory } from '~/factories/UI/PrimeVue/PrimeVueFactory';
import { BootstrapFactory } from '~/factories/UI/Bootstrap/BootstrapFactory';
import type { ComponentFactory } from '~/models/interfaces/ComponentFactory';
import {ComponentTypes} from "~/models/enum/ComponentTypes";
import {HtmlElementsFactory} from "~/factories/UI/HtmlElements/HtmlElementsFactory";

export class ComponentFactoryProvider {
  constructor() {
    console.log('ComponentFactoryProvider inizializzato');
  }

  getFactory(type: string): ComponentFactory {
    switch (type.toLowerCase()) {
      case ComponentTypes.PrimeVue:
        return new PrimeVueFactory();
      case ComponentTypes.Bootstrap:
        return new BootstrapFactory();
      case ComponentTypes.HtmlElements:
        return new HtmlElementsFactory();
      default:
        throw new Error('Component Factory non valido');
    }
  }
}