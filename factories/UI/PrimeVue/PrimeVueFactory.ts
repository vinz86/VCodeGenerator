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

export class PrimeVueFactory implements ComponentFactory {
  private flyweight: Flyweight<DroppableComponent>[] = [];

  private readonly creators: Map<string, () => Component> = new Map([
    ['button', () => this.createButton()],
    ['input', () => this.createInput()],
    ['div', () => this.createGenericElement()],
  ]);

  constructor() {
    this.setFlyweight();
    console.log('PrimeVue flyweigths: ', this.flyweight)
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
    //this.flyweight.configure(this.options);

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
      cat: 'PrimeVue',
      style: '',
      class: '',
      inner: '',
      attributes: {},
    }
    this.flyweight.push(flyweightFactory.getFlyweight('button_PrimeVue', {
      ...commonOptions,
      class: 'p-button p-component',
      inner: 'Button',
      attributes: { type: 'button'},
    }))

    this.flyweight.push(flyweightFactory.getFlyweight('input_PrimeVue', {
      ...commonOptions,
        class: 'p-inputtext p-component',
        attributes: {
          type: 'text',
          placeholder: 'inserisci il testo...',
        },
      })
    )

    this.flyweight.push(flyweightFactory.getFlyweight('element_PrimeVue', {
      ...commonOptions,
    }))
  }
}
