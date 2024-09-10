import type {IDroppableComponent} from "~/models/IDroppableComponent";
import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";
import {ProjectHelper} from "~/helper/ProjectHelper";
import type {ComponentFactoryProvider} from "~/factory/ComponentFactory/ComponentFactoryProvider";

export class ComponentHelper {
    public static createFactoryComponents(data: IDroppableComponent[], factoryProvider: ComponentFactoryProvider): IComponentFactory[] {
        return data.map((componentData) => {
            const newFactoryComponent =  factoryProvider.factory.createElement(componentData);
            const parentId = ProjectHelper.findParentId(componentData, data);

            newFactoryComponent.configure({
                type: componentData?.attributes?.type || '',
                fileId: componentData?.fileId,
                order: data?.length,
                parentId: parentId,
                id: componentData?.id,
                class: componentData?.className,
                className: componentData?.className,
                style: componentData?.style,
                attributes: componentData?.attributes,
                inner: componentData?.inner || ''
            })
            return newFactoryComponent;
        });
    };
}