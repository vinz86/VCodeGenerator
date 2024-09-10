import type {TFile} from "~/models/types/TFile";
import type {EComponentTypes} from "~/models/enum/EComponentTypes";

export interface Project {
  id: string;
  name: string;
  componentsTypes: EComponentTypes;
  files: TFile[];
}
