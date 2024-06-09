import type {DroppableComponent} from "~/components/models/DroppableComponent";

export class DragDropHelper {

    public findParentComponent(parentId: string, componentsArray: DroppableComponent[]) {
        for (const component of componentsArray) {
            if (component?.id?.toString() === parentId) {
                return component;
            }
            if (component.slot && component.slot.length > 0) {
                const found: any = this.findParentComponent(parentId, component.slot);
                if (found) return found;
            }
        }
        return null;
    };

    public findObjectById(data: DroppableComponent[], idToFind: string) {
        if (!data || !Array.isArray(data)) {
            return null;
        }

        for (let i = 0; i < data.length; i++) {
            const item = data[i];

            if (item?.id?.toString() === idToFind) {
                return [i]; // Trovato un oggetto, restituisco la sua index
            }

            if (item.slot && item.slot.length > 0) {
                const nestedPath: any = this.findObjectById(item.slot, idToFind);
                if (nestedPath !== null) {
                    return [i, ...nestedPath]; // Restituisce il path completo
                }
            }
        }

        return null; // Non trovato
    }

    public findComponentByPath(components: DroppableComponent, path: number[]): DroppableComponent|null {
        let currentComponent = components;
        for (const index of path) {
            if (Array.isArray(currentComponent)) {
                currentComponent = currentComponent[index];
            } else {
                return null;
            }
        }
        return currentComponent;
    }

    public removeComponentById(components: DroppableComponent[], id:string) {
        for (let i = 0; i < components.length; i++) {
            const component = components[i];
            if (component.id === id) {
                components.splice(i, 1);
                return true;  // Indica che l'elemento è stato trovato e rimosso
            }
            if (component.slot && component.slot.length > 0) {
                const found = this.removeComponentById(component.slot, id);
                if (found) {
                    return true;  // Indica che l'elemento è stato trovato e rimosso in uno slot annidato
                }
            }
        }
        return false;  // Indica che l'elemento non è stato trovato
    }

    public removeObjectByPath(components:DroppableComponent[], path:number[], index:number = -1):any {
        if (!Array.isArray(components) || !Array.isArray(path) || path.length === 0) {
            return null;
        }

        const currentIndex = path[0];
        if (path.length === 1) {
            if (index >= 0) {
                return components[currentIndex].slot.splice(index, 1)[0]; // Rimuove il componente tramite index dallo slot
            } else {
                return components.splice(currentIndex, 1)[0]; // Rimuove il componente tramite index dall'array principale
            }
        }

        const nestedData = components[currentIndex].slot;
        return this.removeObjectByPath(nestedData, path.slice(1), index);
    }
}