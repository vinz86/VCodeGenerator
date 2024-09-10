import { HttpService } from './HttpService';
import type {IAuthorize} from "~/models/interfaces/DTO/IAuthorize";
import type {IAuthService} from "~/services/api/interfaces/IAuthService";

export class AuthService extends HttpService implements IAuthService{

    //constructor() { super(); }

    public login(formData: IAuthorize): Promise<any> {
        return this.post<any>('authenticate', formData, false);
    }

}
