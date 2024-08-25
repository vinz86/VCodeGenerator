import { BaseRepository} from "~/services/api/repositories/BaseRepository";
import type {IAccount} from "~/models/interfaces/DTO/IAccount";

export class UserRepository extends BaseRepository {
    private static instance: UserRepository;

    private constructor() {
        super();
    }

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }

    public getAccount(): Promise<IAccount[]> {
        return this.get<IAccount[]>('account');
    }

    public getUserById(id: string): Promise<User> {
        return this.get<User>(`/api/users/${id}`);
    }

    public createUser(user: User): Promise<User> {
        return this.post<User>('/api/users', user);
    }

    public updateUser(id: string, user: Partial<User>): Promise<User> {
        return this.put<User>(`/api/users/${id}`, user);
    }

    public deleteUser(id: string): Promise<void> {
        return this.delete<void>(`/api/users/${id}`);
    }
}
