import type { IComponent } from '~/models/interfaces/IComponent'
import type { TComponentOptions } from '~/models/types/TComponentOptions'

export class BootstrapButton implements IComponent {
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

export class BootstrapInput implements IComponent {
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
