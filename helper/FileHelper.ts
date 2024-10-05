import type {TFile} from "~/models/types/TFile";
import type {IProjectService} from "~/services/api/services/interfaces/IProjectService";
import {Api} from "~/services/api/core/Api";
import {ApiKeys} from "~/services/api/ApiKeys";
import {DIContainer} from "~/DIContainer/DIContainer";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import {LoadingManager} from "~/manager/LoadingManager";
import type {TProject} from "~/models/interfaces/TProject";

export class FileHelper {


    public static async getFiles (payload){
        const fileService: IFileService = Api.getService<IFileService>(ApiKeys.FileService);
        const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
        try{
            LoadingManager.getInstance().start();
            const filesData = await fileService.getFiles(payload);
            if (Array.isArray(filesData)) {
                return filesData;
            } else {
                return [] as File[];
            }
        }
        catch (e) { notifyManager.error(e?.message || e); }
        finally { LoadingManager.getInstance().stop(); }
    }

    public static async addFile (file: Partial<File>): Promise<File> {
        const fileService: IFileService = Api.getService<IFileService>(ApiKeys.FileService);
        const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
        try{
            LoadingManager.getInstance().start();

            return await fileService.createFile(file)
        }
        catch (e) { notifyManager.error(e) }
        finally { LoadingManager.getInstance().stop(); }
    };

    public static async editFile (file: Partial<File>): Promise<File> {
        const fileService: IFileService = Api.getService<IFileService>(ApiKeys.FileService);
        const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
        try{
            LoadingManager.getInstance().start();

            return await fileService.updateFile(file.id, file)
        }
        catch (e) { notifyManager.error(e) }
        finally { LoadingManager.getInstance().stop(); }
    };

    public static async deleteFile (fileId: string) {
        const fileService: IFileService = Api.getService<IFileService>(ApiKeys.FileService);
        const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
        try{
            LoadingManager.getInstance().start();
            if (!fileId) notifyManager.error('ID Progetto non valido')

            // TODO: BE Cancellare anche tutti i file contenuti all'interno
            await fileService.deleteFile(fileId)

            return true;
        }
        catch (e) { notifyManager.error(e); return false; }
        finally { LoadingManager.getInstance().stop(); }
    };

    public static findById (id: number, files: TFile[]): TFile {
        return files.find(file => file.id === id);
    }
}