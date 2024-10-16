import type {TProjectType} from "~/models/types/TProjectType";

export interface IProjectTypeService {
    getProjectTypes(): Promise<TProjectType[]>;
    getProjectTypeById(id: string): Promise<TProjectType>;
    createProjectType(extension: TProjectType): Promise<TProjectType>;
    updateProjectType(id: string, ProjectType: Partial<TProjectType>): Promise<TProjectType>;
    deleteProjectType(id: string): Promise<void>;
}