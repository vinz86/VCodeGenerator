import type { IComponent } from '~/models/interfaces/IComponent';
import type { ComponentFactory } from '~/models/interfaces/ComponentFactory';
import type { DroppableComponent } from '~/models/DroppableComponent';
import { PrimeVueButton } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueButton';
import { PrimeVueInput } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueInput';
import { PrimeVueElement } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueElement';
import {DIContainer} from "~/services/DipendencyInjection/DIContainer";
import type {Flyweight} from "~/factory/FlyweightFactory/Flyweight";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import type {IFlyweightComponent} from "~/models/interfaces/IFlyweightComponent";
import {BootstrapButton, BootstrapInput} from "~/factory/ComponentFactory/UI/Bootstrap/BootstrapComponentsImpl";
import {BootstrapElement} from "~/factory/ComponentFactory/UI/Bootstrap/components/BootstrapElement";

export class BootstrapFactory implements ComponentFactory {
  private flyweight: IFlyweightComponent<DroppableComponent>[] = [];

  private readonly creators: Map<string, () => IComponent> = new Map([
    ['button', () => this.createButton()],
    ['input', () => this.createInput()],
    ['div', () => this.createGenericElement()],
  ]);

  constructor() {
    this.setFlyweights();
    console.log('Bootstrap flyweigths: ', this.flyweight)
  }

  createButton(): IComponent {
    return new BootstrapButton();
  }

  createInput(): IComponent {
    return new BootstrapInput();
  }

  createGenericElement(): IComponent {
    return new BootstrapElement();
  }

  createElement(options: DroppableComponent): IComponent {
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
    //this.Flyweight.configure(this.options);

    return element;
  }

  updateElement(component: IComponent, options: Partial<DroppableComponent>): IComponent {
    if (!component) throw new Error('Componente non valido.')
    component.configure(options);

    return component;
  }

  setFlyweights(): void {
    const flyweightFactory = DIContainer.getService<Flyweight<Partial<DroppableComponent>>>(EServiceKeys.FlyweightFactory);
    const commonOptions = {
      cat: 'Bootstrap',
      style: '',
      class: '',
      inner: '',
      attributes: {},
    }
    this.flyweight.push(flyweightFactory.getFlyweight('button_Bootstrap', {
      ...commonOptions,
      class: '',
      inner: 'Button',
      attributes: { type: 'button'},
    }))

    this.flyweight.push(flyweightFactory.getFlyweight('input_Bootstrap', {
          ...commonOptions,
          class: '', // TODO da implementare
          attributes: {
            type: 'text',
            placeholder: 'inserisci il testo...',
          },
        })
    )

    this.flyweight.push(flyweightFactory.getFlyweight('element_Bootstrap', {
      ...commonOptions,
    }))
  }
}
