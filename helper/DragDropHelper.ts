import type {IComponent} from "~/models/interfaces/IComponent";

export class DragDropHelper {

    public static findParentComponent(parentId: string, componentsArray: IComponent[]) {
        for (const component of componentsArray) {
            if (component?.options?.id?.toString() === parentId) {
                return component;
            }
            if (component.options?.slot && component.options?.slot.length > 0) {
                const found: any = DragDropHelper.findParentComponent(parentId, component.options?.slot);
                if (found) return found;
            }
        }
        return null;
    };

    public static findObjectById(data: IComponent[], idToFind: string) {
        if (!data || !Array.isArray(data)) {
            return null;
        }

        for (let i = 0; i < data.length; i++) {
            const item = data[i];

            if (item?.options?.id?.toString() === idToFind) {
                return [i]; // Trovato un oggetto, restituisco la sua index
            }

            if (item?.options?.slot && item?.options?.slot?.length > 0) {
                const nestedPath: any = DragDropHelper.findObjectById(item?.options?.slot, idToFind);
                if (nestedPath !== null) {
                    return [i, ...nestedPath]; // Restituisce il path completo
                }
            }
        }

        return null; // Non trovato
    }

/*    public static findComponentByPath(components: DroppableComponent, path: number[]): DroppableComponent|null {
        let currentComponent = components;
        for (const index of path) {
            if (Array.isArray(currentComponent)) {
                currentComponent = currentComponent[index];
            } else {
                return null;
            }
        }
        return currentComponent;
    }*/

/*    public  static removeComponentById(components: DroppableComponent[], id:string) {
        for (let i = 0; i < components.length; i++) {
            const component = components[i];
            if (component.id === id) {
                components.splice(i, 1);
                return true;  // Indica che l'elemento è stato trovato e rimosso
            }
            if (component.slot && component.slot.length > 0) {
                const found = DragDropHelper.removeComponentById(component.slot, id);
                if (found) {
                    return true;  // Indica che l'elemento è stato trovato e rimosso in uno slot annidato
                }
            }
        }
        return false;  // Indica che l'elemento non è stato trovato
    }*/

    public  static removeObjectByPath(components:IComponent[], path:number[], index:number = -1):any {
        if (!Array.isArray(components) || !Array.isArray(path) || path.length === 0) {
            return null;
        }

        const currentIndex = path[0];
        if (path.length === 1) {
            if (index >= 0) {
                return components?.at(currentIndex)?.options?.slot?.splice(index, 1)[0]; // Rimuove il componente tramite index dallo slot
            } else {
                return components.splice(currentIndex, 1)[0]; // Rimuove il componente tramite index dall'array principale
            }
        }

        const nestedData = components?.at(currentIndex)?.options?.slot;

        if(nestedData)
            return DragDropHelper.removeObjectByPath(nestedData, path.slice(1), index);
    }
}