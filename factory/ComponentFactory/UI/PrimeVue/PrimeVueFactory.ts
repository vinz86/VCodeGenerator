import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import { PrimeVueButton } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueButton';
import { PrimeVueInput } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueInput';
import { GenericContainer } from '~/factory/ComponentFactory/Shared/GenericContainer';
import type { TComponentOptions } from '~/models/types/TComponentOptions';
import {GenericHtmlElement} from "~/factory/ComponentFactory/Shared/GenericHtmlElement";
import {PrimeVueSelect} from "~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueSelect";

export class PrimeVueFactory implements IComponentFactory {

  private readonly creators: Map<string, (options?: TComponentOptions) => IComponentFactory> = new Map([
    ['button', (options:TComponentOptions) => new PrimeVueButton(options)],
    ['input', (options:TComponentOptions) => new PrimeVueInput(options)],
    ['select', (options:TComponentOptions) => new PrimeVueSelect(options)],
    ['div', (options:TComponentOptions) => new GenericContainer(options)],
    ['p', (options: TComponentOptions) => new GenericHtmlElement({ tag: 'p', ...options })],
    ['label', (options: TComponentOptions) => new GenericHtmlElement({ tag: 'label', ...options })],
    ['div', (options: TComponentOptions) => new GenericHtmlElement({ tag: 'div', ...options })],
  ]);

  constructor(){ }

  createElement(options: TComponentOptions): IComponentFactory {
    const creator = this.creators.get(options?.tag?.toLowerCase() || 'div');
    if (!creator) {
      console.warn(`Tipo di elemento sconosciuto: ${options.tag}. Creazione di un elemento predefinito.`);
      return new GenericContainer(options);
    }
    'tag' in options && delete options.tag
    return creator(options);
  }

  updateElement(component: IComponentFactory, options: Partial<TComponentOptions>): IComponentFactory {
    if (!component) throw new Error('Componente non valido.');
    component.configure(options);
    return component;
  }

}

/*
import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import { PrimeVueButton } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueButton';
import { PrimeVueInput } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueInput';
import { GenericContainer } from '~/factory/ComponentFactory/UI/PrimeVue/components/GenericContainer';
import type { TComponentOptions } from '~/models/TComponentOptions';
import {GenericHtmlElement} from "~/factory/ComponentFactory/Shared/GenericHtmlElement";
import {PrimeVueSelect} from "~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueSelect";

export class PrimeVueFactory implements IComponentFactory {

  private readonly creators: Map<string, (options?: TComponentOptions) => IComponentFactory> = new Map([
    ['button', (options:TComponentOptions) => new PrimeVueButton(options)],
    ['input', (options:TComponentOptions) => new PrimeVueInput(options)],
    ['dropdown', (options:TComponentOptions) => new PrimeVueSelect(options)],
    ['div', (options:TComponentOptions) => new GenericContainer(options)],
    ['p', (options: TComponentOptions) => new GenericHtmlElement({ tag: 'p', ...options })],
    ['label', (options: TComponentOptions) => new GenericHtmlElement({ tag: 'label', ...options })],
    ['hr', (options: TComponentOptions) => new GenericHtmlElement({ tag: 'hr', ...options })],
    ['br', (options: TComponentOptions) => new GenericHtmlElement({ tag: 'br', ...options })],
  ]);

  constructor(){ }

  createElement(options: TComponentOptions): IComponentFactory {
    const creator = this.creators.get(options?.tag?.toLowerCase() || 'div');
    if (!creator) {
      console.warn(`Tipo di elemento sconosciuto: ${options.tag}. Creazione di un elemento predefinito.`);
      return new GenericContainer(options);
    }
    'tag' in options && delete options.tag
    return creator(options);
  }

  updateElement(component: IComponentFactory, options: Partial<TComponentOptions>): IComponentFactory {
    if (!component) throw new Error('Componente non valido.');
    component.configure(options);
    return component;
  }

}
 */
