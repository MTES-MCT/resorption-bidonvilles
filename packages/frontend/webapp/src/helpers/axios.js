import axiosLib from "axios";
import ENV from "@/helpers/env.js";
import { useUserStore } from "@/stores/user.store.js";
import logout from "@/utils/logout";

const { API_URL } = ENV;
const ERRORS = {
    MISSING_TOKEN: 1,
    EXPIRED_OR_INVALID_TOKEN: 2,
};

export const axios = axiosLib.create({
    baseURL: API_URL,
    timeout: 60000,
    headers: {
        "x-app-version": __APP_VERSION__,
    },
});

axios.interceptors.request.use((config) => {
    const userStore = useUserStore();
    if (userStore.isLoggedIn) {
        config.headers["x-access-token"] = userStore.accessToken;
    }

    return config;
});

axios.interceptors.response.use(
    (response) => {
        if (response.data?.response) {
            return response.data?.response;
        }

        return response.data;
    },
    (originalError) => {
        let error = {
            user_message: "Une erreur inconnue est survenue",
            error: originalError,
        };

        // @todo: côté API, normaliser la réponse des erreurs pour éviter la gestion des deux
        // formats de réponse
        if (originalError.response?.data?.error) {
            error = originalError.response.data.error;
        } else if (originalError.response?.data?.user_message) {
            error = originalError.response.data;
        }

        // erreurs génériques
        if (
            [ERRORS.MISSING_TOKEN, ERRORS.EXPIRED_OR_INVALID_TOKEN].includes(
                error.code
            )
        ) {
            return logout("/connexion?reason=invalid_token");
        }

        return Promise.reject(error);
    }
);
