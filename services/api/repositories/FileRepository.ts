import { ApiBaseRepository } from "~/services/api/ApiBaseRepository";
import type {TFile} from "~/models/types/TFile";
import type {IFileRepository} from "~/services/api/interfaces/IFileRepository";

export class FileRepository extends ApiBaseRepository implements IFileRepository{

    public getFiles(): Promise<TFile[]> {
        return this.get<TFile[]>('/api/files');
    }

    public getFileById(id: string): Promise<TFile> {
        return this.get<TFile>(`/api/files/${id}`);
    }

    public createFile(file: TFile): Promise<TFile> {
        return this.post<TFile>('/api/files', file);
    }

    public updateFile(id: string, file: Partial<TFile>): Promise<TFile> {
        return this.put<TFile>(`/api/files/${id}`, file);
    }

    public deleteFile(id: string): Promise<void> {
        return this.delete<void>(`/api/files/${id}`);
    }
}
