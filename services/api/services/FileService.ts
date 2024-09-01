import { ApiHttpService } from "~/services/api/ApiHttpService";
import type {TFile} from "~/models/types/TFile";
import type {IFileService} from "~/services/api/interfaces/IFileService";

export class FileService extends ApiHttpService implements IFileService{

    //constructor() { super(); }

    public getFiles(queryParams:Record<string, any>): Promise<TFile[]> {
        return this.get<TFile[]>('t-files', queryParams);
    }

    public getFileById(id: string): Promise<TFile> {
        return this.get<TFile>(`t-files/${id}`);
    }

    public createFile(file: TFile): Promise<TFile> {
        return this.post<TFile>('t-files', file);
    }

    public updateFile(id: string, file: Partial<TFile>): Promise<TFile> {
        return this.put<TFile>(`t-files/${id}`, file);
    }

    public deleteFile(id: string): Promise<void> {
        return this.delete<void>(`t-files/${id}`);
    }
}
