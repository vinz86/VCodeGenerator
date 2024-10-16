import type {TFileExtension} from "~/models/types/TFileExtension";
import type {IFileExtensionService} from "~/services/api/services/interfaces/IFileExtensionService";
import {ApiHttpService} from "~/services/api/core/ApiHttpService";

export class FileExtensionService extends ApiHttpService implements IFileExtensionService{

    constructor() {
        super();
        this.baseUrl = 'file-extensions'
    }

    public getFileExtensions(queryParams:Record<string, any>): Promise<TFileExtension[]> {
        return this.get<TFileExtension[]>(this.baseUrl, queryParams);
    }

    public getFileExtensionById(id: string): Promise<TFileExtension> {
        return this.get<TFileExtension>(`${this.baseUrl}/${id}`);
    }

    public createFileExtension(FileExtension: TFileExtension): Promise<TFileExtension> {
        return this.post<TFileExtension>(this.baseUrl, FileExtension);
    }

    public updateFileExtension(id: string, FileExtension: Partial<TFileExtension>): Promise<TFileExtension> {
        return this.patch<TFileExtension>(`${this.baseUrl}/${id}`, FileExtension);
    }

    public deleteFileExtension(id: string): Promise<void> {
        return this.delete<void>(`${this.baseUrl}/${id}`);
    }
}
