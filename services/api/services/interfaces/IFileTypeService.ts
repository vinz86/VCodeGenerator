import type {TFileType} from "~/models/types/TFileType";

export interface IFileTypeService {
    getFileTypes(queryParams: Record<string, any>): Promise<TFileType[]>;
    getFileTypeById(id: string): Promise<TFileType>;
    createFileType(data: TFileType): Promise<TFileType>;
    updateFileType(id: string, data: Partial<TFileType>): Promise<TFileType>;
    deleteFileType(id: string): Promise<void>;
}
