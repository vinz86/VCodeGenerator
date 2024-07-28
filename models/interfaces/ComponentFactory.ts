import type {Component} from "~/models/interfaces/Component";
import type {DroppableComponent} from "~/models/DroppableComponent";

export interface ComponentFactory {
  createButton(): Component;
  createInput(): Component;
  createElement(options: DroppableComponent): Component;
  updateElement(component: Component, options: Partial<DroppableComponent>): Component
  setFlyweight(options: DroppableComponent): Component
}
