import type {IAccount} from "~/models/interfaces/DTO/IAccount";
import type {IUser} from "~/models/interfaces/DTO/IUser";

export interface IUserRepository {
    getAccount(): Promise<IAccount[]>;
    getUsers(): Promise<IUser[]>;
    getUserById(id: string): Promise<IUser>;
    createUser(user: IUser): Promise<IUser>;
    updateUser(id: string, user: Partial<IUser>): Promise<IUser>;
    deleteUser(id: string): Promise<void>;
}
