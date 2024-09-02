import { ApiHttpService } from "~/services/api/ApiHttpService";
import type {TFile} from "~/models/types/TFile";
import type {IFileService} from "~/services/api/interfaces/IFileService";

export class FileService extends ApiHttpService implements IFileService{

    constructor() {
        super();
        this.baseUrl = 'files'
    }

    public getFiles(queryParams:Record<string, any>): Promise<TFile[]> {
        return this.get<TFile[]>(this.baseUrl, queryParams);
    }

    public getFileById(id: string): Promise<TFile> {
        return this.get<TFile>(`${this.baseUrl}/${id}`);
    }

    public createFile(file: TFile): Promise<TFile> {
        return this.post<TFile>(this.baseUrl, file);
    }

    public updateFile(id: string, file: Partial<TFile>): Promise<TFile> {
        return this.put<TFile>(`${this.baseUrl}/${id}`, file);
    }

    public deleteFile(id: string): Promise<void> {
        return this.delete<void>(`${this.baseUrl}/${id}`);
    }
}
