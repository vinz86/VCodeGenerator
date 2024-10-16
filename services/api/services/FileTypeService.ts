import type { TFileType } from "~/models/types/TFileType";
import type { IFileTypeService } from "~/services/api/services/interfaces/IFileTypeService";
import { ApiHttpService } from "~/services/api/core/ApiHttpService";

export class FileTypeService extends ApiHttpService implements IFileTypeService {
    constructor() {
        super();
        this.baseUrl = 'file-types';
    }

    public getFileTypes(queryParams: Record<string, any>): Promise<TFileType[]> {
        return this.get<TFileType[]>(this.baseUrl, queryParams);
    }

    public getFileTypeById(id: string): Promise<TFileType> {
        return this.get<TFileType>(`${this.baseUrl}/${id}`);
    }

    public createFileType(data: TFileType): Promise<TFileType> {
        return this.post<TFileType>(this.baseUrl, data);
    }

    public updateFileType(id: string, data: Partial<TFileType>): Promise<TFileType> {
        return this.patch<TFileType>(`${this.baseUrl}/${id}`, data);
    }

    public deleteFileType(id: string): Promise<void> {
        return this.delete<void>(`${this.baseUrl}/${id}`);
    }
}
