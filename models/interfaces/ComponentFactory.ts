import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";
import type {IDroppableComponent} from "~/models/IDroppableComponent";

export interface ComponentFactory {
  createButton(): IComponentFactory;
  createInput(): IComponentFactory;
  createElement(options: IDroppableComponent): IComponentFactory;
  updateElement(component: IComponentFactory, options: Partial<IDroppableComponent>): IComponentFactory
  setFlyweights(): void
}
