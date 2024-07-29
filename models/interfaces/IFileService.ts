import type { TFile } from '~/models/types/TFile';

export interface IFileService {
    createFile(name: string, type: 'file' | 'folder'): TFile;
    removeFile(files: TFile[], fileId: string): TFile[];
    renameFile(files: TFile[], fileId: string, newName: string): TFile[];
    moveFile(files: TFile[], fileId: string, targetFolderId: string): TFile[];
}
