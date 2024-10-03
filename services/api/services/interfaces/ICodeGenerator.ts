export interface ICodeGenerator {
    generateCodeByFileId(fileId: number): Promise<'string'>;
}
