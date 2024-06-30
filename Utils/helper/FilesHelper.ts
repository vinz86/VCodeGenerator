export class FilesHelper {

    public importProject(file: File): Promise<object|boolean> {
        if (!file) return Promise.resolve(false);

        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    if (e.target && e.target.result !== null) {
                        const parsedResult = JSON.parse(e.target.result as string);
                        resolve(parsedResult);
                    } else {
                        resolve(false);
                    }
                }
                catch (e) { console.error('Errore:', e) }
            };
            reader.onerror = () => {
                console.error('Errore durante la lettura del file.');
                resolve(false);
            };
            reader.readAsText(file);
        });
    }

    public exportProject(project: object): boolean {
        if (!project || !Array.isArray(project) || project?.length === 0) return false;

        const jsonData = JSON.stringify(project);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vcg_project-${Date.now()}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        return true;
    }

    public exportHtml(html: string): boolean {
        if (!html || html?.length === 0) return false;

        let _ncode = `<template>\n${html}\n</template>`;
        const blob = new Blob([_ncode], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vcg_export-${Date.now()}.html`;
        a.click();
        window.URL.revokeObjectURL(url);
        return true;
    }

}