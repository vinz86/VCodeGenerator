import type {FileModel} from '~/models/interfaces/FileModel';
import type {FileServiceInterface} from "~/models/interfaces/FileServiceInterface";
import {FilesTypes} from "~/models/enum/FilesTypes";

export class FileService implements FileServiceInterface {
    private static instance: FileService;

    public static getInstance(): FileService {
        if (!FileService.instance) {
            FileService.instance = new FileService();
        }
        return FileService.instance;
    }

    // Genera un ID unico
    private generateId(): string {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // Crea un nuovo file o cartella
    public createFile(name: string, type: FilesTypes): FileModel {
        return {
            id: this.generateId(),
            name,
            type,
            children: type === FilesTypes.Folder ? [] : undefined,
        };
    }

    // Rimuove un file o cartella dal progetto
    public removeFile(files: FileModel[], fileId: string): FileModel[] {
        return files.filter(file => {
            if (file.id === fileId) {
                return false;
            }
            if (file.type === FilesTypes.Folder && file.children) {
                file.children = this.removeFile(file.children, fileId);
            }
            return true;
        });
    }

    // Rinomina un file o cartella
    public renameFile(files: FileModel[], fileId: string, newName: string): FileModel[] {
        files.forEach(file => {
            if (file.id === fileId) {
                file.name = newName;
            } else if (file.type === 'folder' && file.children) {
                this.renameFile(file.children, fileId, newName);
            }
        });
        return files;
    }

    // Sposta un file o cartella in un'altra cartella
    public moveFile(files: FileModel[], fileId: string, targetFolderId: string): FileModel[] {
        let fileToMove: FileModel | null = null;
        const updatedFiles = files.filter(file => {
            if (file.id === fileId) {
                fileToMove = file;
                return false;
            }
            if (file.type === 'folder' && file.children) {
                file.children = this.moveFile(file.children, fileId, targetFolderId);
            }
            return true;
        });

        if (fileToMove) {
            this.findAndAddToTarget(updatedFiles, targetFolderId, fileToMove);
        }

        return updatedFiles;
    }

    // Trova la cartella target e aggiunge il file/cartella spostato
    private findAndAddToTarget(files: FileModel[], targetFolderId: string, fileToAdd: FileModel): void {
        files.forEach(file => {
            if (file.id === targetFolderId && file.type === 'folder' && file.children) {
                file.children.push(fileToAdd);
            } else if (file.type === 'folder' && file.children) {
                this.findAndAddToTarget(file.children, targetFolderId, fileToAdd);
            }
        });
    }
}
