import type {TComponentOptions} from "~/models/types/TComponentOptions";

export interface IComponentFactory {
  render: () => string;
  configure(options: TComponentOptions): void;
  options: TComponentOptions;
  style?: {};
}