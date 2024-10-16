import type {TComponentPreset} from "~/models/types/TComponentPreset";
import type {IComponentPresetService} from "~/services/api/services/interfaces/IComponentPresetService";
import {ApiHttpService} from "~/services/api/core/ApiHttpService";

export class ComponentPresetService extends ApiHttpService implements IComponentPresetService{

    constructor() {
        super();
        this.baseUrl = 'component-presets'
    }

    public getComponentPresets(queryParams:Record<string, any>): Promise<TComponentPreset[]> {
        return this.get<TComponentPreset[]>(this.baseUrl, queryParams);
    }

    public getComponentPresetById(id: string): Promise<TComponentPreset> {
        return this.get<TComponentPreset>(`${this.baseUrl}/${id}`);
    }

    public createComponentPreset(data: TComponentPreset): Promise<TComponentPreset> {
        return this.post<TComponentPreset>(this.baseUrl, data);
    }

    public updateComponentPreset(id: string, data: Partial<TComponentPreset>): Promise<TComponentPreset> {
        return this.patch<TComponentPreset>(`${this.baseUrl}/${id}`, data);
    }

    public deleteComponentPreset(id: string): Promise<void> {
        return this.delete<void>(`${this.baseUrl}/${id}`);
    }
}
