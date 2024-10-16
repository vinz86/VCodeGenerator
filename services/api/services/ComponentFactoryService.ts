import type { TComponentFactory } from "~/models/types/TComponentFactory";
import type { IComponentFactoryService } from "~/services/api/services/interfaces/IComponentFactoryService";
import { ApiHttpService } from "~/services/api/core/ApiHttpService";

export class ComponentFactoryService extends ApiHttpService implements IComponentFactoryService {
    constructor() {
        super();
        this.baseUrl = 'component-factories';
    }

    public getComponentFactories(queryParams: Record<string, any>): Promise<TComponentFactory[]> {
        return this.get<TComponentFactory[]>(this.baseUrl, queryParams);
    }

    public getComponentFactoryById(id: string): Promise<TComponentFactory> {
        return this.get<TComponentFactory>(`${this.baseUrl}/${id}`);
    }

    public createComponentFactory(data: TComponentFactory): Promise<TComponentFactory> {
        return this.post<TComponentFactory>(this.baseUrl, data);
    }

    public updateComponentFactory(id: string, data: Partial<TComponentFactory>): Promise<TComponentFactory> {
        return this.patch<TComponentFactory>(`${this.baseUrl}/${id}`, data);
    }

    public deleteComponentFactory(id: string): Promise<void> {
        return this.delete<void>(`${this.baseUrl}/${id}`);
    }
}
