import type { IComponentService } from "~/services/api/services/interfaces/IComponentService";
import type { IComponent } from "~/models/interfaces/IComponent";
import {ApiHttpService} from "~/services/api/core/ApiHttpService";

export class ComponentService extends ApiHttpService implements IComponentService {
    private readonly baseUrl: string;

    constructor() {
        super();
        this.baseUrl = 'i-components';
    }

    private serializeAttributes(component: IComponent): IComponent {
        return {
            ...component,
            attributes: component.attributes ? JSON.stringify(component.attributes) : null
        };
    }

    private deserializeAttributes(component: IComponent): IComponent {
        return {
            ...component,
            attributes: component.attributes ? JSON.parse(component.attributes as unknown as string) : null
        };
    }

    createComponent(component: IComponent): Promise<IComponent> {
        const serializedComponent = this.serializeAttributes(component);
        return this.post<IComponent>(this.baseUrl, serializedComponent).then(this.deserializeAttributes);
    }

    deleteComponent(id: string): Promise<void> {
        return this.delete(`${this.baseUrl}/${id}`);
    }

    getComponentById(id: string): Promise<IComponent> {
        return this.get<IComponent>(`${this.baseUrl}/${id}`).then(this.deserializeAttributes);
    }

    getComponents(searchParams: IComponent): Promise<IComponent[]> {
        return this.get<IComponent[]>(this.baseUrl, searchParams).then(components =>
            components.map(this.deserializeAttributes)
        );
    }

    updateComponent(id: string, component: Partial<IComponent>): Promise<IComponent> {
        const serializedComponent = component.attributes
            ? this.serializeAttributes(component as IComponent)
            : component;
        return this.patch<IComponent>(`${this.baseUrl}/${id}`, serializedComponent).then(this.deserializeAttributes);
    }
}
