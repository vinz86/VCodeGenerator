import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";
import type {IDroppableComponent} from "~/models/IDroppableComponent";
import type {DroppableProps} from "~/models/DroppableProps";

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

    private static processSlotContent = (slotContent: IComponentFactory[]) => {
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

    public static generateCodeFromComponents(components: IComponentFactory[]): string{
        let generatedCodeValue:string = '';

        for (const component of components) {
            generatedCodeValue += generatedCodeValue += ProjectHelper.generateCodeRecursive(component);
        }

        return generatedCodeValue;
    }

    private static generateCodeRecursive(component: IComponentFactory):string {
        let code = '';

        if (!component?.options || !component?.options.tag) {
            return code;
        }
        const options: IDroppableComponent = component?.options;

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
                code += ProjectHelper.processSlotContent(component.options?.slot as IComponentFactory[]);
            }

            code += `\n</${component.options?.tag}>\n`;
        } else {
            code += '/>\n';
        }

        return code;
    };
    public static getBindAttributes (attribute: DroppableProps){
        if (!attribute) return;
        delete attribute?.selectedComponent;
        delete attribute?.parentComponents;
        console.log(attribute)
        return attribute;
    }

    public static getUniqueID(){
        const array = new Uint32Array(10);
        return self.crypto.getRandomValues(array).toString().replaceAll(',', '');
    }
}