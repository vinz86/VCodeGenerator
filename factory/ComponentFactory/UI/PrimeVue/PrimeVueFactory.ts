import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import { PrimeVueButton } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueButton';
import { PrimeVueInput } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueInput';
import { PrimeVueElement } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueElement';
import { PrimeVueContainer } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueContainer';
import type { IDroppableComponent } from '~/models/IDroppableComponent';
import { DIContainer } from '~/DIContainer/DIContainer';
import type { FlyweightFactory } from '~/factory/FlyweightFactory/FlyweightFactory';
import { EServiceKeys } from '~/models/enum/EServiceKeys';
import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';
import Button from "primevue/button";
import {PrimeVueFlyweightManager} from "~/factory/ComponentFactory/UI/PrimeVue/PrimeVueFlyweightManager";

export class PrimeVueFactory implements IComponentFactory {
  private flyweight: IFlyweightComponent<any>[] = [];
  private flyweightManager: PrimeVueFlyweightManager;

  private readonly creators: Map<string, (options?: IDroppableComponent) => IComponentFactory> = new Map([
    ['button', (options) => new PrimeVueButton(options)],
    ['input', (options) => new PrimeVueInput(options)],
    ['div', (options) => new PrimeVueElement(options)],
    ['container', (options) => new PrimeVueContainer(options)],

  ]);

  constructor(flyweightFactory: FlyweightFactory<Partial<IDroppableComponent>>) {
    this.flyweightManager = new PrimeVueFlyweightManager(flyweightFactory);
    // Configura i Flyweight usando la nuova classe
    //this.flyweightManager.setFlyweights();
  }

  createElement(options: IDroppableComponent): IComponentFactory {
    const creator = this.creators.get(options?.tag?.toLowerCase() || 'div');
    'tag' in options && delete options.tag
    if (!creator) {
      console.warn(`Tipo di elemento sconosciuto: ${options.tag}. Creazione di un elemento predefinito.`);
      return new PrimeVueElement(options);
    }
    return creator(options);
  }

  updateElement(component: IComponentFactory, options: Partial<IDroppableComponent>): IComponentFactory {
    if (!component) throw new Error('Componente non valido.');
    component.configure(options);
    return component;
  }

}
