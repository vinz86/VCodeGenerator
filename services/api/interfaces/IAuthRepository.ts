import type {IAuthorize} from "~/models/interfaces/DTO/IAuthorize";

export interface IAuthRepository {
    login(formData: IAuthorize): Promise<any>;
}