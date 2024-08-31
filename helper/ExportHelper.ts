import type {Project} from "~/models/interfaces/Project";
import {DIContainer} from "~/DipendencyInjection/DIContainer";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {EServiceKeys} from "~/models/enum/EServiceKeys";

export class ExportHelper {

    public static importProject(file: File): Promise<boolean|Project> {
        if (!file) return Promise.resolve(false);

        const notify = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);

        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    if (e.target && e.target.result !== null) {
                        const parsedResult = JSON.parse(e.target.result as string);
                        notify.success('Errore durante la lettura del file.');
                        resolve(parsedResult);
                    } else {
                        notify.error('Errore durante l\'importazione del progetto.');
                        resolve(false);
                    }
                }
                catch (e) { console.error('Errore:', e) }
            };
            reader.onerror = () => {
                notify.error('Errore durante la lettura del file.');
                resolve(false);
            };
            reader.readAsText(file);
        });
    }

    public static exportProject(project: object): boolean {
        if (!project || !Array.isArray(project) || project?.length === 0) return false;

        const notify = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);

        const jsonData = JSON.stringify(project);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vcg_project-${Date.now()}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        notify.success('Progetto esportato correttamente.');
        return true;
    }

    public static exportHtml(html: string): boolean {
        if (!html || html?.length === 0) return false;

        const notify = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);

        let template = `<template>\n${html}\n</template>`;
        const blob = new Blob([template], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vcg_export-${Date.now()}.html`;
        a.click();
        window.URL.revokeObjectURL(url);
        notify.success('HTML esportato correttamente.');
        return true;
    }

}