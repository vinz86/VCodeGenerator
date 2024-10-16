import type {TComponentFactory} from "~/models/types/TComponentFactory";

export interface IComponentFactoryService {
    getComponentFactories(queryParams: Record<string, any>): Promise<TComponentFactory[]>;
    getComponentFactoryById(id: string): Promise<TComponentFactory>;
    createComponentFactory(data: TComponentFactory): Promise<TComponentFactory>;
    updateComponentFactory(id: string, data: Partial<TComponentFactory>): Promise<TComponentFactory>;
    deleteComponentFactory(id: string): Promise<void>;
}
