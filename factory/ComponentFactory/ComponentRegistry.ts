import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";

class ComponentRegistry {
    private creators: Map<string, () => IComponentFactory> = new Map();

    registerComponent(tag: string, creator: () => IComponentFactory) {
        this.creators.set(tag.toLowerCase(), creator);
    }

    getComponentFactory(tag: string): (() => IComponentFactory) | undefined {
        return this.creators.get(tag.toLowerCase());
    }
}
