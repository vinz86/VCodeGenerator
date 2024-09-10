import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";
import type {IDroppableComponent} from "~/models/IDroppableComponent";
import type {DroppableProps} from "~/models/DroppableProps";
import type {IProjectService} from "~/services/api/interfaces/IProjectService";
import {ApiContainer} from "~/services/api/ApiContainer";
import {EApiKeys} from "~/models/enum/EApiKeys";
import type {Project} from "~/models/interfaces/Project";
import {LoadingManager} from "~/manager/LoadingManager";

export class ProjectHelper {

    public static async getProjects (){
        try{
            LoadingManager.getInstance().start();
            return await projectService.getProjects();
        }
        catch (e) { notifyManager.error(e?.message || e); }
        finally { LoadingManager.getInstance().stop(); }
    }

    public static async addProject (project: Partial<Project>): Promise<Project> {
        try{
            LoadingManager.getInstance().start();

            return await projectService.createProject(newProject.value)
        }
        catch (e) { notifyManager.error(e) }
        finally { LoadingManager.getInstance().stop(); }
    };

    public static async deleteProject (projectId: string) {
        const projectService: IProjectService = ApiContainer.getService<IProjectService>(EApiKeys.ProjectService);
        try{
            LoadingManager.getInstance().start();
            if (!projectId) notifyManager.error('ID Progetto non valido')

            // TODO: BE Cancellare anche tutti i file contenuti all'interno
            await projectService.deleteProject(projectId)

            return true;
        }
        catch (e) { notifyManager.error(e); return false; }
        finally { LoadingManager.getInstance().stop(); }
    };

    public static findProjectById(id: string, projects: Project[]): Project|null {
        return projects.find(p => p.id === id);
    }

    public static removeProjectById(id: string, projects: Project[]): Project|null {
        return projects.filter(p => p.id !== id);
    }


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
    public static getBindAttributes (options: IDroppableComponent){

/*        {
            "label": "Label",
            "": "",
            "inner": "Button",
            "tag": "Button",
            "attributes": {
                "label": "Label"
            },
            "fileId": 1504,
            "order": 2,
            "parentId": null,
            "id": 1513,
            "class": "",
            "style": null
        }

        */


/*        if (!attributes) return;
        'selectedComponent' in attributes && delete attributes?.selectedComponent;
        'parentComponents' in attributes && delete attributes?.parentComponents;
        'type' in attributes && delete attributes?.type;
        'cat' in attributes && delete attributes?.cat;
        'componentsType' in attributes && delete attributes?.componentsType;
        'className' in attributes && delete attributes?.className;
        'attributes' in attributes && delete attributes?.attributes;
        'order' in attributes && delete attributes?.order;
        'tag' in attributes && delete attributes?.tag;

        return attributes;*/

        if (!options) return;
        return {
            ...options.attributes,
            id: options.id || '',
            class: options.className || '',
            style: options.style || '',
            inner: options.inner || '',
        }
    }

    public static getParsedAttributes = <T>(attributes: string): T => {
        try {
            return JSON.parse(attributes) as T;
        } catch (e) {
            return {} as T;
        }
    }
    public static getUniqueID(){
        const array = new Uint32Array(10);
        return self.crypto.getRandomValues(array).toString().replaceAll(',', '');
    }

    public static findParentId = (component: any, components: any[]): string | null => {
        for (const comp of components) {
            if (comp.children && comp.children.includes(component)) {
                return comp.id;
            }

            const parentId = ProjectHelper.findParentId(component, comp.children || []);
            if (parentId !== null) {
                return parentId;
            }
        }
        return null;
    };

    public static getComponentOrder(parentId: string, targetComponents: IComponentFactory) {
        const filteredComponents = targetComponents.filter(c => c.options.parentId === parentId);
        return filteredComponents?.length || 0;
    }
}