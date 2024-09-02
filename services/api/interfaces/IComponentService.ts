import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";
import type {IComponent} from "~/models/interfaces/IComponent";

export interface IComponentService {
    getComponents(component: IComponent): Promise<IComponent[]>;
    getComponentById(id: string): Promise<IComponent>;
    createComponent(component: IComponent): Promise<IComponent>;
    updateComponent(id: string, component: Partial<IComponent>): Promise<IComponent>;
    deleteComponent(id: string): Promise<void>;
}