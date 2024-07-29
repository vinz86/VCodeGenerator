import type {IComponent} from "~/models/interfaces/IComponent";
import type {DroppableComponent} from "~/models/DroppableComponent";

export class ProjectHelper {

    public static copyTextareaToClipboard(textareaID: string): void {
        const textarea = document.getElementById(textareaID) as HTMLTextAreaElement;
        if (textarea) {
            textarea.disabled = false;
            textarea.select();
            document.execCommand("copy");
            textarea.disabled = true;
        }
    }

    private static processSlotContent = (slotContent: IComponent[]) => {
        let slotCode = '';

        if (Array.isArray(slotContent)) {
            for (const nestedComponent of slotContent) {
                slotCode += ProjectHelper.generateCodeRecursive(nestedComponent);
            }
        } else {
            slotCode += slotContent;
        }

        return slotCode;
    }

    public static generateMainStyle (components: IComponent[]){
/*        if (components.style) {
            let generatedCodeValue = components.styleType ? `<style lang="${components.styleType}">` : '<style lang="css">';
            generatedCodeValue += components.style;
            generatedCodeValue += '</style>';
            return generatedCodeValue;

        }*/
        console.log('generateMainStyle non implementata')
    }

    public static generateCodeFromComponents(components: IComponent[]): string{
        let generatedCodeValue:string = '';

        for (const component of components) {
            generatedCodeValue += generatedCodeValue += ProjectHelper.generateCodeRecursive(component);
        }
        // Aggiungo stile
        ProjectHelper.generateMainStyle(components);

        return generatedCodeValue;
    }

    private static generateCodeRecursive(component: IComponent):string {
        let code = '';

        if (!component?.options || !component?.options.tag) {
            return code;
        }
        const options: DroppableComponent = component?.options;

        if (options) {
            code += `<${options?.tag} `;
            if (options.id && options.id.trim() !== '') {
                code += `id="${component.options.id}" `;
            }

            if (options.class && options.class.trim() !== '') {
                code += `class="${options.class}" `;
            }

            if (options.style && options.style.trim() !== '') {
                code += `style="${component.options.style}" `;
            }

            if (options?.attributes) {
                for (const key in options?.attributes) {
                    code += `${key}="${options?.attributes[key]}" `;
                }
            }
        }

        if (options?.inner || options?.slot) {
            code += '>\n';

            if (options?.inner) {
                code += options?.inner;
            }

            if (options?.slot) {
                code += ProjectHelper.processSlotContent(component.options?.slot);
            }

            code += `\n</${component.options?.tag}>\n`;
        } else {
            code += '/>\n';
        }

        return code;
    };

/*
    public static droppableComponentToComponent(droppableComponent: DroppableComponent, componentFactory: ComponentFactory) : IComponent {
        if (!droppableComponent?.name) return {} as IComponent;

        let element: IComponent;
        switch(droppableComponent?.name){
            case 'div' || 'DroppableComponent':
                element = componentFactory.createElement();
                element.configure(droppableComponent);
                break;
            case 'button':
                element = componentFactory.createButton();
                element.configure(droppableComponent);
                break;
            case 'input':
                element = componentFactory.createInput();
                element.configure(droppableComponent);
                break;
            default:
                element = componentFactory.createElement();
                element.configure(droppableComponent);

        }
        return element
    }*/


}