import type {IUserService} from "~/services/api/services/interfaces/IUserService";
import {Api} from "~/services/api/Api";
import {ApiKeys} from "~/services/api/ApiKeys";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {LoadingManager} from "~/manager/LoadingManager";
import {DIContainer} from "~/DIContainer/DIContainer";


export const useUserStore = defineStore('user', (): Promise<User> => {
    const user = ref<User | null>(null);
    const error = ref<string | null>(null);

    const userService: IUserService = Api.getService<IUserService>(ApiKeys.UserService);
    const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);

    async function fetchUser() {
        LoadingManager.getInstance().start();
        error.value = null;
        try {
            const result = await userService.getAccount();
            if(result){
                user.value = result;
            }
        } catch (err) {
            error.value = err;
            notifyManager.error('Errore durante il recupero dell\'utente');
        } finally {
            LoadingManager.getInstance().stop()
        }
    };

    return {
        user,
        error,
        fetchUser,
    };
});
