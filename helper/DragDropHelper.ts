import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";

export class DragDropHelper {

    public static findParentComponent(parentId: string, componentsArray: IComponentFactory[]) {
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

    public static findObjectById(data: IComponentFactory[], idToFind: string) {
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

/*    public static findComponentByPath(components: IDroppableComponent, path: number[]): IDroppableComponent|null {
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

/*    public  static removeComponentById(components: IDroppableComponent[], id:string) {
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

    public  static removeObjectByPath(components:IComponentFactory[], path:number[], index:number = -1):any {
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
    static getComponentData(event: DragEvent) {
        const data = event.dataTransfer?.getData('component');
        return data ? JSON.parse(data) : null;
    }

    static setComponentData(event: DragEvent, index: number, component: any) {
        event.dataTransfer?.setData('component', JSON.stringify({ index, component }));
    }

    static getDropTarget(event: DragEvent): HTMLElement | null {
        return event.target as HTMLElement;
    }

    static isComponentDroppable(target: HTMLElement): boolean {
        return target.dataset.vin === 'droppable';
    }

    static findDropTargetIndex(target: HTMLElement, components: any[]): number {
        // Determine the drop index based on the target element
        const index = components.findIndex(component => component.id === target.dataset.componentId);
        return index;
    }

    static calculateDropIndex = (mouseY: number): number => {
            const componentElements = document.querySelectorAll('.draggable-component');
            if (componentElements.length === 0) return 0; // se non ci sono componenti, return 0

            for (let i = 0; i < componentElements.length; i++) {
                const { top, bottom } = componentElements[i].getBoundingClientRect();
                if (mouseY < top) {
                    return i; // return index se il mouse è sopra un componente
                }
            }
            return componentElements.length; // se il mouse è sotto tutti i componenti
        };
}


