import { BaseRepository } from "~/services/api/repositories/BaseRepository";
import type {TFile} from "~/models/types/TFile";

export class FileRepository extends BaseRepository {
    private static instance: FileRepository;

    private constructor() {
        super();
    }

    public static getInstance(): FileRepository {
        if (!FileRepository.instance) {
            FileRepository.instance = new FileRepository();
        }
        return FileRepository.instance;
    }

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
