import { BaseRepository } from './BaseRepository';
import type {IAuthData} from "~/pages/login.vue";

export class AuthRepository extends BaseRepository {
    private static instance: AuthRepository;

    private constructor() {
        super();
    }

    public static getInstance(): AuthRepository {
        if (!AuthRepository.instance) {
            AuthRepository.instance = new AuthRepository();
        }
        return AuthRepository.instance;
    }

    public login(formData: IAuthData): Promise<any> {
        return this.post<any>('authenticate', formData);
    }

}
