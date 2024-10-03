import type {ICodeGenerator} from "~/services/api/services/interfaces/ICodeGenerator";
import {ApiHttpService} from "~/services/api/core/ApiHttpService";

export class CodeGeneratorService extends ApiHttpService implements ICodeGenerator{
    constructor() {
        super();
        this.baseUrl = 'generate-code'
    }

    generateCodeByFileId(fileId: number): Promise<"string"> {
        return this.get<string>(`${this.baseUrl}/${fileId}`);
    }
}
