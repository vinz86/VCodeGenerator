import type {TComponentOptions} from "~/models/types/TComponentOptions";
import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";
import type {ComponentFactoryProvider} from "~/factory/ComponentFactory/ComponentFactoryProvider";
import type {IComponentService} from "~/services/api/services/interfaces/IComponentService";
import {Api} from "~/services/api/core/Api";
import {ApiKeys} from "~/services/api/ApiKeys";

export class ComponentHelper {

    public static createFactoryComponents(data: TComponentOptions[], factoryProvider: ComponentFactoryProvider): IComponentFactory[] {
        return data.map((componentData) => {
            const newFactoryComponent =  factoryProvider.factory.createElement(componentData);

            newFactoryComponent.configure({
                type: componentData?.attributes?.type,
                fileId: componentData?.fileId,
                order: componentData?.order,
                parentId: componentData?.parentId,
                id: componentData?.id,
                class: componentData?.className,
                className: componentData?.className,
                style: componentData?.style,
                attributes: componentData?.attributes,
                inner: componentData?.inner
            })
            return newFactoryComponent;
        });
    };


    public static buildComponentTree(components: IComponentFactory[]): IComponentFactory[] {
        if (!components) return [];

        components.sort((a, b) => a.options.order - b.options.order); // ordina per order

        const componentMap: { [key: number]: IComponentFactory } = {};
        const tree: IComponentFactory[] = [];
        components.forEach((component) => {
            componentMap[component.options.id] = component;
            component.options.slot = [];
        });

        function buildSlots(component: IComponentFactory) {
            const parentId = component.options.id;
            const children = components
                .filter(c => c.options.parentId === parentId)
                .sort((a, b) => a.options.order - b.options.order); // ordina per order

            children.forEach((child) => {
                component.options.slot.push(child);
                buildSlots(child);
            });
        }

        components.forEach((component) => {
            if (component.options.parentId === null || component.options.parentId === 0) {
                tree.push(component);
                buildSlots(component);
            }
        });

        return tree;
    }


    public static buildPrimeVueTree(components: IComponentFactory[]): any[] {
        if (!components) return [];

        const componentMap: { [key: number]: IComponentFactory } = {};
        const tree: any[] = [];

        components.sort((a, b) => a.options.order - b.options.order);

        components.forEach((component) => {
            componentMap[component.options.id] = component;
            component.options.slot = [];
        });

        components.forEach((component) => {
            const parentId = component.options.parentId;

            const treeNode = {
                key: component.options.id,
                label: (component.options.label || component.options.name || component.options.tag) + ' ' + component.options.id,
                data: component,
                children: []
            };

            if (parentId === null || parentId === 0) {
                // nodo radice, aggiungi direttamente all'albero
                tree.push(treeNode);
            } else {
                //nodo figlio aggiungi allo slot del padre
                const parentComponent = componentMap[parentId];
                if (parentComponent) {
                    parentComponent.options.slot.push(component);
                    const parentNode = tree.find(node => node.key === parentId);
                    parentNode?.children.push(treeNode);
                }
            }
        });

        return tree;
    }

    public static getComponentOrder(parentId: string, targetComponents: IComponentFactory[], dropIndex: number) {
        // Filtra i componenti che hanno lo stesso parentId
        const filteredComponents = targetComponents
            .filter(c => c.options.parentId === parentId)
            .sort((a, b) => a.options.order - b.options.order); // Ordina per 'order'

        if (dropIndex >= filteredComponents.length) {
            // Se l'indice di drop è alla fine, assegna un ordine più alto dell'ultimo
            return filteredComponents.length > 0
                ? filteredComponents[filteredComponents.length - 1].options.order + 1
                : 0; // Se non ci sono componenti, l'ordine sarà 0
        }

        // Se si inserisce in una posizione specifica, assegna l'ordine basato sul componente precedente
        return dropIndex > 0
            ? filteredComponents[dropIndex - 1].options.order + 1
            : 0; // Se è il primo componente, ordine sarà 0
    }

    public static getChildren (parentId: number, components: IComponentFactory[]) {
        return components.value.filter(component => component.parentId === parentId);
    };

    public static getRootComponents(components: IComponentFactory[]): IComponentFactory[] {
        if (!components) return [];

        return components.filter(component =>
            component.options.parentId === null || component.options.parentId === 0
        );
    }
    public static async updateComponentsOrder(components: IComponentFactory[]): Promise<void> {
        if (!components) return [];

        const componentService: IComponentService = Api.getService<IComponentService>(ApiKeys.ComponentService);
        const updatePromises = components.map(component =>
            componentService.updateComponent(component.options.id, {id: component.options?.id, order: component.options?.order})
        );
        await Promise.all(updatePromises);
    }

    public static isDroppableComponent (component): boolean{
        return component.options?.type === 'DroppableComponent' || component?.type === 'DroppableComponent';
    }

    public static filterComponentProps (component, props): any {
        const droppableComponentProps = ['componentFactory', 'file', 'children'];
        const filteredProps = { ...props };

        if (ComponentHelper.isDroppableComponent(component)) {
            return {
                ...filteredProps,
                ...droppableComponentProps.reduce((acc, prop) => {
                    if (prop in filteredProps) acc[prop] = filteredProps[prop];
                    return acc;
                }, {}),
            };
        }

        droppableComponentProps.forEach(prop => {
            if (prop in filteredProps) delete filteredProps[prop];
        });

        return filteredProps;
    };

    public static extractComponentsOptions(factories: IComponentFactory[]): TComponentOptions[] {
        return factories.map(factory => {
            const { options } = factory;

            return { ...options };
        });
    }
}