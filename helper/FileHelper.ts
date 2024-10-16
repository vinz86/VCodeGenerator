import type {TFile} from "~/models/types/TFile";
import {Api} from "~/services/api/Api";
import {ApiKeys} from "~/services/api/ApiKeys";
import {DIContainer} from "~/DIContainer/DIContainer";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import {LoadingManager} from "~/manager/LoadingManager";
import type {IFileExtensionService} from "~/services/api/services/interfaces/IFileExtensionService";
import type {TFileExtension} from "~/models/types/TFileExtension";
import type {IFileService} from "~/services/api/services/interfaces/IFileService";
import {EFileTypes} from "~/models/enum/EFileTypes";
import {useUserStore} from "~/store/useUserStore";

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
                return [] as TFile[];
            }
        }
        catch (e) { notifyManager.error(e?.message || e); }
        finally { LoadingManager.getInstance().stop(); }
    }

    public static async addFile (file: Partial<TFile>): Promise<TFile> {
        const fileService: IFileService = Api.getService<IFileService>(ApiKeys.FileService);
        const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
        try{
            LoadingManager.getInstance().start();
            if (file.type === EFileTypes.Folder) {
                try{
                    delete file.extension;
                } catch(e) {}
            }
            file.userId = useUserStore().user.id
            return await fileService.createFile(file)
        }
        catch (e) { notifyManager.error(e) }
        finally { LoadingManager.getInstance().stop(); }
    };

    public static async editFile (file: Partial<TFile>): Promise<TFile> {
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

    public static async getExtensions (): Promise<FileExtensions[]> {
        const fileExtensionsService: IFileExtensionService = Api.getService<IFileExtensionService>(ApiKeys.FileExtensionsService);
        const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);
        try{
            LoadingManager.getInstance().start();

            const filesExtensions = await fileExtensionsService.getFileExtensions()
            if (Array.isArray(filesExtensions)) {
                return filesExtensions;
            } else {
                return [] as TFileExtension[];
            }
        }
        catch (e) { notifyManager.error(e); return false; }
        finally { LoadingManager.getInstance().stop(); }
    };

    public static findById (id: number, files: TFile[]): TFile {
        return files.find(file => file.id === id);
    }
}