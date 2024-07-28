import type { Component } from '~/models/interfaces/Component';
import type { ComponentFactory } from '~/models/interfaces/ComponentFactory';
import type { DroppableComponent } from '~/models/DroppableComponent';
import { PrimeVueButton } from '~/factories/UI/PrimeVue/components/PrimeVueButton';
import { PrimeVueInput } from '~/factories/UI/PrimeVue/components/PrimeVueInput';
import { PrimeVueElement } from '~/factories/UI/PrimeVue/components/PrimeVueElement';
import {DIContainer} from "~/services/DipendencyInjection/DIContainer";
import type {FlyweightFactory} from "~/factories/flyweight/FlyweightFactory";
import {ServiceKeys} from "~/models/enum/ServiceKeys";
import type {Flyweight} from "~/models/interfaces/Flyweight";

export class HtmlElementsFactory implements ComponentFactory {
  private flyweight: Flyweight<DroppableComponent>[] = [];

  private readonly creators: Map<string, () => Component> = new Map([
    ['div', () => this.createGenericElement()],
  ]);

  constructor() {
    this.setFlyweight();
  }

  createButton(): Component {
    return new PrimeVueButton();
  }

  createInput(): Component {
    return new PrimeVueInput();
  }

  createGenericElement(): Component {
    return new PrimeVueElement();
  }

  createElement(options: DroppableComponent): Component {
    if (!options?.tag) {
      console.warn('Nessun tag specificato, viene creato un elemento predefinito');
      return this.createGenericElement();
    }

    const creator = this.creators.get(options.tag.toLowerCase());

    if (!creator) {
      console.warn(`Tipo di elemento sconosciuto: ${options.tag}. Creazione di un elemento predefinito.`);
      return this.createGenericElement();
    }

    const element = creator();
    element.configure({...options});

    return element;
  }

  updateElement(component: Component, options: Partial<DroppableComponent>): Component {
    if (!component) throw new Error('Componente non valido.')
    component.configure(options);

    return component;
  }

  setFlyweight(options: Partial<DroppableComponent>): void {
    const flyweightFactory = DIContainer.getService<FlyweightFactory<Partial<DroppableComponent>>>(ServiceKeys.FlyweightFactory);
    const commonOptions = {
      cat: 'Html',
      style: '',
      class: '',
      inner: '',
      attributes: {},
    }
    this.flyweight.push(flyweightFactory.getFlyweight('element_HtmlElements', {
      ...commonOptions,
    }))
  }
}
