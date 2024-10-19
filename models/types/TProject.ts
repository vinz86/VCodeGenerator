import type {TUser} from "~/models/types/TUser";
import type {TProjectState} from "~/models/types/TProjectState";
import type {TComponentFactory} from "~/models/types/TComponentFactory";
import type {TProjectType} from "~/models/types/TProjectType";

export type TProject = {
  id?: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
  deletedAt?: string;
  user: TUser;
  status?: TProjectState;
  componentFactory?: TComponentFactory;
  projectType?: TProjectType;
};