import type {TAuthority} from "~/models/types/TAuthority";

export type TUser = {
    id?: number;
    login: string;
    password: string;
    activated: boolean;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    langKey: string;
    authorities: TAuthority[];
};