import type {TFile} from '~/models/types/TFile';
import type {IFileService} from "~/models/interfaces/IFileService";
import {EFileTypes} from "~/models/enum/EFileTypes";

export class FileService implements IFileService {
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
    public createFile(name: string, type: EFileTypes): TFile {
        return {
            id: this.generateId(),
            name,
            type,
            children: type === EFileTypes.Folder ? [] : undefined,
        };
    }

    // Rimuove un file o cartella dal progetto
    public removeFile(files: TFile[], fileId: string): TFile[] {
        return files.filter(file => {
            if (file.id === fileId) {
                return false;
            }
            if (file.type === EFileTypes.Folder && file.children) {
                file.children = this.removeFile(file.children, fileId);
            }
            return true;
        });
    }

    // Rinomina un file o cartella
    public renameFile(files: TFile[], fileId: string, newName: string): TFile[] {
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
    public moveFile(files: TFile[], fileId: string, targetFolderId: string): TFile[] {
        let fileToMove: TFile | null = null;
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
    private findAndAddToTarget(files: TFile[], targetFolderId: string, fileToAdd: TFile): void {
        files.forEach(file => {
            if (file.id === targetFolderId && file.type === 'folder' && file.children) {
                file.children.push(fileToAdd);
            } else if (file.type === 'folder' && file.children) {
                this.findAndAddToTarget(file.children, targetFolderId, fileToAdd);
            }
        });
    }
}
