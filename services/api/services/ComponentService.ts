import { ApiHttpService } from "~/services/api/ApiHttpService";
import type {IComponentService} from "~/services/api/interfaces/IComponentService";
import type {IComponent} from "~/models/interfaces/IComponent";
import type {Project} from "~/models/interfaces/Project";

export class ComponentService extends ApiHttpService implements IComponentService {
    private readonly baseUrl: string

    constructor() {
        super();
        this.baseUrl = 'i-components'
    }

    createComponent(component: IComponent): Promise<IComponent> {
        return this.post<IComponent>(this.baseUrl, component);
    }

    deleteComponent(id: string): Promise<void> {
        return this.delete(`${this.baseUrl}/${id}`)
    }

    getComponentById(id: string): Promise<IComponent> {
        return this.get<IComponent>(`${this.baseUrl}/${id}`);
    }

    getComponents(searchParams: IComponent): Promise<IComponent[]> {
        return this.get<IComponent>(this.baseUrl, searchParams);
    }

    updateComponent(id: string, component: Partial<IComponent>): Promise<IComponent> {
        return this.put<IComponent>(`${this.baseUrl}/${id}`, component);
    }

}
