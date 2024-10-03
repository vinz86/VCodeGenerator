import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";
import type {IComponentOptions} from "~/models/IComponentOptions";

export interface ComponentFactory {
  createButton(): IComponentFactory;
  createInput(): IComponentFactory;
  createElement(options: IComponentOptions): IComponentFactory;
  updateElement(component: IComponentFactory, options: Partial<IComponentOptions>): IComponentFactory
  setFlyweights(): void
}
