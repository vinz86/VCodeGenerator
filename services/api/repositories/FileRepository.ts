import { ApiBaseRepository } from "~/services/api/ApiBaseRepository";
import type {TFile} from "~/models/types/TFile";
import type {IFileRepository} from "~/services/api/interfaces/IFileRepository";

export class FileRepository extends ApiBaseRepository implements IFileRepository{

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
