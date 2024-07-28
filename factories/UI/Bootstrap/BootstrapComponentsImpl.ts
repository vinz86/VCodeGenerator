import type { Component } from '~/models/interfaces/Component'
import type { ComponentOptions } from '~/models/interfaces/ComponentOptions'

export class BootstrapButton implements Component {
  options = {
    class: '',
    style: '',
    attributes: {}
  };

  configure(options: ComponentOptions): void {
    this.options = { ...this.options, ...options };
  }

  render(): string {
    return `<button class="btn btn-primary ${this.options.class}" style="${this.options.style}">Bootstrap Button</button>`;
  }
}

export class BootstrapInput implements Component {
  options = {
    class: '',
    style: '',
    attributes: {}
  };

  configure(options: ComponentOptions): void {
    this.options = { ...this.options, ...options };
  }

  render(): string {
    return `<input class="form-control ${this.options.class}" style="${this.options.style}" />`;
  }
}
