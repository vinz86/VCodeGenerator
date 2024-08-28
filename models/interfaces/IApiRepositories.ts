import type {ApiClient} from "~/services/api/ApiClient";
import type {AuthRepository} from "~/services/api/repositories/AuthRepository";
import type {UserRepository} from "~/services/api/repositories/UserRepository";
import type {ProjectRepository} from "~/services/api/repositories/ProjectRepository";
import type {FileRepository} from "~/services/api/repositories/FileRepository";

export interface IApiRepositories {
    http: ApiClient;
    auth: AuthRepository;
    user: UserRepository;
    project: ProjectRepository;
    files: FileRepository;
}