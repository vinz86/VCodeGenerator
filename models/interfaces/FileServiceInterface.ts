import type { FileModel } from '~/models/interfaces/FileModel';

export interface FileServiceInterface {
    createFile(name: string, type: 'file' | 'folder'): FileModel;
    removeFile(files: FileModel[], fileId: string): FileModel[];
    renameFile(files: FileModel[], fileId: string, newName: string): FileModel[];
    moveFile(files: FileModel[], fileId: string, targetFolderId: string): FileModel[];
}
