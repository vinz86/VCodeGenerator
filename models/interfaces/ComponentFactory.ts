import type {IComponent} from "~/models/interfaces/IComponent";
import type {IDroppableComponent} from "~/models/IDroppableComponent";

export interface ComponentFactory {
  createButton(): IComponent;
  createInput(): IComponent;
  createElement(options: IDroppableComponent): IComponent;
  updateElement(component: IComponent, options: Partial<IDroppableComponent>): IComponent
  setFlyweights(): void
}
