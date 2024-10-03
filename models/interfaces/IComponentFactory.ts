import type {IComponentOptions} from "~/models/IComponentOptions";

export interface IComponentFactory {
  render: () => string;
  configure(options: IComponentOptions): void;
  options: IComponentOptions;
  style?: {};
}