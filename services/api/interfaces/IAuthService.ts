import type {IAuthorize} from "~/models/interfaces/DTO/IAuthorize";

export interface IAuthService {
    login(formData: IAuthorize): Promise<any>;
}