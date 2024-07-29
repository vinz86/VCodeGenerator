import type {TFile} from "~/models/types/TFile";

export interface Project {
  id: string;
  name: string;
  files: TFile[];
}
