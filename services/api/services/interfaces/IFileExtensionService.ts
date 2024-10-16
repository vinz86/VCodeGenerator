import type {TFileExtension} from "~/models/types/TFileExtension";

export interface IFileExtensionService {
    getFileExtensions(): Promise<TFileExtension[]>;
    getFileExtensionById(id: string): Promise<TFileExtension>;
    createFileExtension(extension: TFileExtension): Promise<TFileExtension>;
    updateFileExtension(id: string, FileExtension: Partial<TFileExtension>): Promise<TFileExtension>;
    deleteFileExtension(id: string): Promise<void>;
}