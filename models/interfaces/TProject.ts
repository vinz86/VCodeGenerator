import type {TFile} from "~/models/types/TFile";
import type {EComponentTypes} from "~/models/enum/EComponentTypes";
import type {EProjectTypes} from "~/models/enum/EProjectTypes";

export type TProject = {
  id: number;
  name: string;
  componentsType: EComponentTypes;
  projectType: EProjectTypes;
  createdAt: string;
  updatedAt: string;
  tUser: number;
  files: TFile[];
}
