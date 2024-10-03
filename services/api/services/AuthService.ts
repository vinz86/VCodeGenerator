import type {IAuthorize} from "~/models/interfaces/DTO/IAuthorize";
import type {IAuthService} from "~/services/api/services/interfaces/IAuthService";
import {ApiHttpService} from "~/services/api/core/ApiHttpService";

export class AuthService extends ApiHttpService implements IAuthService{

    constructor() { super(); }

    public setTokenInCookie(token: string): void {
        document.cookie = `authToken=${token}; path=/; Secure; SameSite=Lax`;
    }

    public getTokenFromCookie(): string | null {
        const matches = document.cookie.match(new RegExp('(?:^|; )authToken=([^;]*)'));
        return matches ? decodeURIComponent(matches[1]) : null;
    }

    public login(formData: IAuthorize): Promise<any> {
        return this.post<any>('authenticate', formData, false);
    }

}
