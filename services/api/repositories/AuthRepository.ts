import { ApiBaseRepository } from '../ApiBaseRepository';
import type {IAuthorize} from "~/models/interfaces/DTO/IAuthorize";
import type {IAuthRepository} from "~/services/api/interfaces/IAuthRepository";

export class AuthRepository extends ApiBaseRepository implements IAuthRepository{

    //constructor() { super(); }

    public login(formData: IAuthorize): Promise<any> {
        return this.post<any>('authenticate', formData, false);
    }

}
