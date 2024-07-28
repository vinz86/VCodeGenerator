import type {FileModel} from "~/models/interfaces/FileModel";

export interface Project {
  id: string;
  name: string;
  files: FileModel[];
}
