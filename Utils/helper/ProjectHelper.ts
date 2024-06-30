import type {DroppableComponent} from "~/models/DroppableComponent";

export class ProjectHelper {

    public copyTextareaToClipboard(textareaID: string): void {
        const textarea = document.getElementById(textareaID) as HTMLTextAreaElement;
        if (textarea) {
            textarea.disabled = false;
            textarea.select();
            document.execCommand("copy");
            textarea.disabled = true;
        }
    }

    private processSlotContent = (slotContent: DroppableComponent[]) => {
        let slotCode = '';

        if (Array.isArray(slotContent)) {
            for (const nestedComponent of slotContent) {
                slotCode += this.generateCodeRecursive(nestedComponent);
            }
        } else {
            slotCode += slotContent;
        }

        return slotCode;
    }

    public generateCodeRecursive(component: DroppableComponent) {
        let code = '';

        if (!component || !component.tag) {
            return code;
        }

        code += `<${component.tag} `;

        if (component.props) {
            if (component.props.id && component.props.id.trim() !== '') {
                code += `id="${component.props.id}" `;
            }

            if (component.props.class && component.props.class.trim() !== '') {
                code += `class="${component.props.class}" `;
            }

            if (component.props.style && component.props.style.trim() !== '') {
                code += `style="${component.props.style}" `;
            }

            if (component.props.attrs) {
                for (const key in component.props.attrs) {
                    code += `${key}="${component.props.attrs[key]}" `;
                }
            }
        }

        if (component.props?.text || (component.slot && component.slot.length > 0)) {
            code += '>\n';

            if (component.props.text) {
                code += component.props.text;
            }

            if (component.slot && component.slot.length > 0) {
                code += this.processSlotContent(component.slot);
            }

            code += `\n</${component.tag}>\n`;
        } else {
            code += '/>\n';
        }

        return code;
    };


}