import type {IDroppableComponent} from "~/models/IDroppableComponent";

export interface IComponentFactory {
  render: () => string;
  configure(options: IDroppableComponent): void;
  options: IDroppableComponent;
  style?: {};
}