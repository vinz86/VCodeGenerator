import type {IComponent} from "~/models/interfaces/IComponent";
import type {DroppableComponent} from "~/models/DroppableComponent";

export interface ComponentFactory {
  createButton(): IComponent;
  createInput(): IComponent;
  createElement(options: DroppableComponent): IComponent;
  updateElement(component: IComponent, options: Partial<DroppableComponent>): IComponent
  setFlyweights(): void
}
