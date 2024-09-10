import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import { PrimeVueButton } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueButton';
import { PrimeVueInput } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueInput';
import { PrimeVueElement } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueElement';
import { PrimeVueContainer } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueContainer';
import type { IDroppableComponent } from '~/models/IDroppableComponent';

export class PrimeVueFactory implements IComponentFactory {

  private readonly creators: Map<string, (options?: IDroppableComponent) => IComponentFactory> = new Map([
    ['button', (options:IDroppableComponent) => new PrimeVueButton(options)],
    ['input', (options:IDroppableComponent) => new PrimeVueInput(options)],
    ['div', (options:IDroppableComponent) => new PrimeVueElement(options)],
    ['container', (options:IDroppableComponent) => new PrimeVueContainer(options)],
  ]);

  constructor(){ }

  createElement(options: IDroppableComponent): IComponentFactory {
    const creator = this.creators.get(options?.tag?.toLowerCase() || 'div');
    if (!creator) {
      console.warn(`Tipo di elemento sconosciuto: ${options.tag}. Creazione di un elemento predefinito.`);
      return new PrimeVueElement(options);
    }
    'tag' in options && delete options.tag
    return creator(options);
  }

  updateElement(component: IComponentFactory, options: Partial<IDroppableComponent>): IComponentFactory {
    if (!component) throw new Error('Componente non valido.');
    component.configure(options);
    return component;
  }

}
