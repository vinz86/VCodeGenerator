import type {IAccount} from "~/models/interfaces/DTO/IAccount";

interface IAppState {
    authToken: string;
    currentUser: IAccount;
}