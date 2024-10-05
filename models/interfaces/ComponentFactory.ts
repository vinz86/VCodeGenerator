import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";
import type {TComponentOptions} from "~/models/types/TComponentOptions";

export interface ComponentFactory {
  createButton(): IComponentFactory;
  createInput(): IComponentFactory;
  createElement(options: TComponentOptions): IComponentFactory;
  updateElement(component: IComponentFactory, options: Partial<TComponentOptions>): IComponentFactory
  setFlyweights(): void
}
