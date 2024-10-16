import type {TProjectType} from "~/models/types/TProjectType";
import type {IProjectTypeService} from "~/services/api/services/interfaces/IProjectTypeService";
import {ApiHttpService} from "~/services/api/core/ApiHttpService";

export class ProjectTypeService extends ApiHttpService implements IProjectTypeService{

    constructor() {
        super();
        this.baseUrl = 'project-types'
    }

    public getProjectTypes(queryParams:Record<string, any>): Promise<TProjectType[]> {
        return this.get<TProjectType[]>(this.baseUrl, queryParams, true);
    }

    public getProjectTypeById(id: string): Promise<TProjectType> {
        return this.get<TProjectType>(`${this.baseUrl}/${id}`);
    }

    public createProjectType(data: TProjectType): Promise<TProjectType> {
        return this.post<TProjectType>(this.baseUrl, data);
    }

    public updateProjectType(id: string, data: Partial<TProjectType>): Promise<TProjectType> {
        return this.patch<TProjectType>(`${this.baseUrl}/${id}`, data);
    }

    public deleteProjectType(id: string): Promise<void> {
        return this.delete<void>(`${this.baseUrl}/${id}`);
    }
}
