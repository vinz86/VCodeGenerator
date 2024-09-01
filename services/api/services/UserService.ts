import { ApiHttpService} from "~/services/api/ApiHttpService";
import type {IAccount} from "~/models/interfaces/DTO/IAccount";
import type {IUser} from "~/models/interfaces/DTO/IUser";
import type {IUserService} from "~/services/api/interfaces/IUserService";

export class UserService extends ApiHttpService implements IUserService{

    //constructor() { super(); }

    public getAccount(): Promise<IAccount[]> {
        return this.get<IAccount[]>('account', {}, false, true);
    }

    public getUsers(): Promise<IUser[]> {
        return this.get<IUser>(`users`);
    }
    public getUserById(id: string): Promise<IUser> {
        return this.get<IUser>(`users/${id}`);
    }

    public createUser(user: IUser): Promise<IUser> {
        return this.post<IUser>('users', user);
    }

    public updateUser(id: string, user: Partial<IUser>): Promise<IUser> {
        return this.put<IUser>(`users/${id}`, user);
    }

    public deleteUser(id: string): Promise<void> {
        return this.delete<void>(`users/${id}`);
    }
}
