import type {DroppableComponent} from "~/models/DroppableComponent";

export interface Component {
  render: () => string;
  configure(options: DroppableComponent): void;
  options: DroppableComponent;
  style?: {};
}
