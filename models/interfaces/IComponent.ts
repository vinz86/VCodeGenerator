import type {DroppableComponent} from "~/models/DroppableComponent";

export interface IComponent {
  render: () => string;
  configure(options: DroppableComponent): void;
  options: DroppableComponent;
  style?: {};
}
