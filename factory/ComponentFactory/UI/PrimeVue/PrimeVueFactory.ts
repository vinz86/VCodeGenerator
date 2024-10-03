import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import { PrimeVueButton } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueButton';
import { PrimeVueInput } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueInput';
import { PrimeVueElement } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueElement';
import type { IComponentOptions } from '~/models/IComponentOptions';
import {GenericHtmlElement} from "~/factory/ComponentFactory/Shared/GenericHtmlElement";
import {PrimeVueDropdown} from "~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueDropdown";

export class PrimeVueFactory implements IComponentFactory {

  private readonly creators: Map<string, (options?: IComponentOptions) => IComponentFactory> = new Map([
    ['button', (options:IComponentOptions) => new PrimeVueButton(options)],
    ['input', (options:IComponentOptions) => new PrimeVueInput(options)],
    ['dropdown', (options:IComponentOptions) => new PrimeVueDropdown(options)],
    ['div', (options:IComponentOptions) => new PrimeVueElement(options)],
    ['p', (options: IComponentOptions) => new GenericHtmlElement({ tag: 'p', ...options })],
    ['label', (options: IComponentOptions) => new GenericHtmlElement({ tag: 'label', ...options })],
    ['hr', (options: IComponentOptions) => new GenericHtmlElement({ tag: 'hr', ...options })],
    ['br', (options: IComponentOptions) => new GenericHtmlElement({ tag: 'br', ...options })],
  ]);

  constructor(){ }

  createElement(options: IComponentOptions): IComponentFactory {
    const creator = this.creators.get(options?.tag?.toLowerCase() || 'div');
    if (!creator) {
      console.warn(`Tipo di elemento sconosciuto: ${options.tag}. Creazione di un elemento predefinito.`);
      return new PrimeVueElement(options);
    }
    'tag' in options && delete options.tag
    return creator(options);
  }

  updateElement(component: IComponentFactory, options: Partial<IComponentOptions>): IComponentFactory {
    if (!component) throw new Error('Componente non valido.');
    component.configure(options);
    return component;
  }

}
