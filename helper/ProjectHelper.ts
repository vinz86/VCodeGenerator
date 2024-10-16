import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";
import type {TComponentOptions} from "~/models/types/TComponentOptions";
import type {TComponentAttributes} from "~/models/types/TComponentAttributes";
import type {IProjectService} from "~/services/api/services/interfaces/IProjectService";
import {Api} from "~/services/api/Api";
import {ApiKeys} from "~/services/api/ApiKeys";
import type {TProject} from "~/models/interfaces/TProject";
import {LoadingManager} from "~/manager/LoadingManager";
import {DIContainer} from "~/DIContainer/DIContainer";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {EServiceKeys} from "~/models/enum/EServiceKeys";

export class ProjectHelper {

    public static async getProjects (payload: Partial<TProject>): Promise<TProject[]>{
        const projectService: IProjectService = Api.getService<IProjectService>(ApiKeys.ProjectService);
        const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
        try{
            LoadingManager.getInstance().start();
            const projectsData = await projectService.getProjects(payload);
            if (Array.isArray(projectsData)) {
                return projectsData;
            } else {
                return [] as TProject[];
            }
        }
        catch (e) { notifyManager.error(e?.message || e); }
        finally { LoadingManager.getInstance().stop(); }
    }

    public static async getProjectById (id: number): Promise<TProject>{
        const projectService: IProjectService = Api.getService<IProjectService>(ApiKeys.ProjectService);
        const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
        try{
            LoadingManager.getInstance().start();
            const projectsData = await projectService.getProjectById(id);
            if (projectsData) {
                return projectsData;
            } else {
                return {} as TProject;
            }
        }
        catch (e) { notifyManager.error(e?.message || e); }
        finally { LoadingManager.getInstance().stop(); }
    }

    public static async addProject (project: Partial<TProject>): Promise<TProject> {
        const projectService: IProjectService = Api.getService<IProjectService>(ApiKeys.ProjectService);
        const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
        try{
            LoadingManager.getInstance().start();

            return await projectService.createProject(project)
        }
        catch (e) { notifyManager.error(e) }
        finally { LoadingManager.getInstance().stop(); }
    };

    public static async editProject (project: Partial<TProject>): Promise<TProject> {
        const projectService: IProjectService = Api.getService<IProjectService>(ApiKeys.ProjectService);
        const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
        try{
            LoadingManager.getInstance().start();

            return await projectService.updateProject(project.id, project)
        }
        catch (e) { notifyManager.error(e) }
        finally { LoadingManager.getInstance().stop(); }
    };

    public static async deleteProject (projectId: string) {
        const projectService: IProjectService = Api.getService<IProjectService>(ApiKeys.ProjectService);
        const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
        try{
            LoadingManager.getInstance().start();
            if (!projectId) notifyManager.error('ID Progetto non valido')

            // TODO: BE Cancellare anche tutti i file contenuti all'interno
            const resultDelete = await projectService.deleteProject(projectId)
            return true;
        }
        catch (e) { notifyManager.error(e); return false; }
        finally { LoadingManager.getInstance().stop(); }
    };

    public static async countProjects (): Promise<number> {
        const projectService: IProjectService = Api.getService<IProjectService>(ApiKeys.ProjectService);
        const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
        try{
            LoadingManager.getInstance().start();
            return await projectService.count()
        }
        catch (e) { notifyManager.error(e); }
        finally { LoadingManager.getInstance().stop(); }
    };

    public static findProjectById(id: string, projects: TProject[]): TProject|null {
        return projects.find(p => p.id === id);
    }

    public static removeProjectById(id: string, projects: TProject[]): TProject|null {
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
        const options: TComponentOptions = component?.options;

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
    public static getBindAttributes (options: TComponentOptions){
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

    public static stringToObject(str: string): object {
        try{
            const objStr = str.replaceAll(/(\w+):/g, '"$1":').replaceAll(/'/g, '"');
            return JSON.parse(objStr);
        } catch (e) {
            return {};
        }
    }

    public static stringToBoolean(str: string): boolean {
        if(!str) return false

        return str.toLowerCase() === 'true' || parseInt(str) === 1;
    }

    public static stringToNumber(str: string): number {
        try{
            return str && isNaN(str) ? parseInt(str) : 0;
        } catch (e) {
            return 0;
        }
    }
}