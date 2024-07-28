import type { ComponentFactory } from '~/models/interfaces/ComponentFactory'
import type { Component } from '~/models/interfaces/Component'
import { BootstrapButton, BootstrapInput } from '~/factories/UI/Bootstrap/BootstrapComponentsImpl'
import type {DroppableComponent} from "~/models/DroppableComponent";

export class BootstrapFactory implements ComponentFactory {
  createButton(): Component {
    return new BootstrapButton();
  }

  createInput(): Component {
    return new BootstrapInput();
  }

  createElement(options: DroppableComponent) : Component {
    if (!options?.tag) return {} as Component;

    let element: Component;
    switch(options?.tag){
      case 'div' || 'DroppableComponent':
        element = this.createElement();
        element.configure(options);
        break;
      case 'button':
        element = this.createButton();
        element.configure(options);
        break;
      case 'input':
        element = this.createInput();
        element.configure(options);
        break;
      default:
        element = this.createElement();
        element.configure(options);

    }
    return element
  }
}
