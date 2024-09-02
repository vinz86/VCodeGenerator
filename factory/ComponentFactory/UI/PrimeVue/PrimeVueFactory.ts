import type { IComponentFactory } from '~/models/interfaces/IComponentFactory';
import type { ComponentFactory } from '~/models/interfaces/ComponentFactory';
import type { IDroppableComponent } from '~/models/IDroppableComponent';
import { PrimeVueButton } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueButton';
import { PrimeVueInput } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueInput';
import { PrimeVueElement } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueElement';
import { PrimeVueContainer } from '~/factory/ComponentFactory/UI/PrimeVue/components/PrimeVueContainer';
import { DIContainer } from '~/DIContainer/DIContainer';
import type { Flyweight } from '~/factory/FlyweightFactory/Flyweight';
import { EServiceKeys } from '~/models/enum/EServiceKeys';
import type { IFlyweightComponent } from '~/models/interfaces/IFlyweightComponent';

export class PrimeVueFactory implements ComponentFactory {
  private flyweight: Map<string, IFlyweightComponent<IDroppableComponent>> = new Map();

  private readonly creators: Map<string, () => IComponentFactory> = new Map([
    ['button', () => this.createButton()],
    ['input', () => this.createInput()],
    ['div', () => this.createGenericElement()],
    ['container', () => this.createContainer()],
  ]);

  constructor() {
    this.setFlyweights();
    console.log('PrimeVue flyweights: ', Array.from(this.flyweight.keys()));
  }

  createButton(): IComponentFactory {
    return new PrimeVueButton();
  }

  createInput(): IComponentFactory {
    return new PrimeVueInput();
  }

  createGenericElement(): IComponentFactory {
    return new PrimeVueElement();
  }

  createContainer(): IComponentFactory {
    return new PrimeVueContainer();
  }

  createElement(options: IDroppableComponent): IComponentFactory {
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
    const flyweightFactory = DIContainer.getService<Flyweight<IDroppableComponent>>(EServiceKeys.FlyweightFactory);
    const flyweight = flyweightFactory.getFlyweight(options.tag, options);

    element.configure(flyweight.options as IDroppableComponent);
    return element;
  }

  updateElement(component: IComponentFactory, options: Partial<IDroppableComponent>): IComponentFactory {
    if (!component) throw new Error('Componente non valido.');

    // Recupera e aggiorna le opzioni tramite il flyweight
    const flyweightFactory = DIContainer.getService<Flyweight<IDroppableComponent>>(EServiceKeys.FlyweightFactory);
    const flyweight = flyweightFactory.getFlyweight(component.options.tag || '', options);

    component.configure(flyweight.options as IDroppableComponent);
    return component;
  }

  setFlyweights(): void {
    const flyweightFactory = DIContainer.getService<Flyweight<IDroppableComponent>>(EServiceKeys.FlyweightFactory);
    const commonOptions = {
      cat: 'PrimeVue',
      style: '',
      className: '',
      inner: '',
      attributes: {},
    };

    this.flyweight.set('button_PrimeVue', flyweightFactory.getFlyweight('button_PrimeVue', {
      ...commonOptions,
      inner: 'Button',
      name: 'ButtonComponent',
      tag: 'Button',
    }));

    this.flyweight.set('inputtext_PrimeVue', flyweightFactory.getFlyweight('inputtext_PrimeVue', {
      ...commonOptions,
      name: 'InputComponent',
      tag: 'InputText',
      attributes: {
        placeholder: 'Inserisci il testo...',
      },
    }));

    this.flyweight.set('element_PrimeVue', flyweightFactory.getFlyweight('element_PrimeVue', {
      ...commonOptions,
      slot: [],
    }));

    this.flyweight.set('container_PrimeVue', flyweightFactory.getFlyweight('container_PrimeVue', {
      ...commonOptions,
      name: 'ContainerComponent',
      tag: 'Container',
      inner: 'Container',
    }));
  }
}
