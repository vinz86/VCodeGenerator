import type {TFile} from "~/models/types/TFile";

export interface IFileService {
    getFiles(): Promise<TFile[]>;
    getFileById(id: string): Promise<TFile>;
    createFile(file: TFile): Promise<TFile>;
    updateFile(id: string, file: Partial<TFile>): Promise<TFile>;
    deleteFile(id: string): Promise<void>;
}