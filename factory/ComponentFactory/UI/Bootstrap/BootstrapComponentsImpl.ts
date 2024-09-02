import type { IComponentFactory } from '~/models/interfaces/IComponentFactory'
import type { TComponentOptions } from '~/models/types/TComponentOptions'

export class BootstrapButton implements IComponentFactory {
  options = {
    class: '',
    style: '',
    attributes: {}
  };

  configure(options: TComponentOptions): void {
    this.options = { ...this.options, ...options };
  }

  render(): string {
    return `<button class="btn btn-primary ${this.options.class}" style="${this.options.style}">Bootstrap Button</button>`;
  }
}

export class BootstrapInput implements IComponentFactory {
  options = {
    class: '',
    style: '',
    attributes: {}
  };

  configure(options: TComponentOptions): void {
    this.options = { ...this.options, ...options };
  }

  render(): string {
    return `<input class="form-control ${this.options.class}" style="${this.options.style}" />`;
  }
}
