import type {IDroppableComponent} from "~/models/IDroppableComponent";

export interface IComponent {
  render: () => string;
  configure(options: IDroppableComponent): void;
  options: IDroppableComponent;
  style?: {};
}
