import axiosLib from "axios";
import ENV from "@/helpers/env.js";
import { useUserStore } from "@/stores/user.store.js";
import logout from "@/utils/logout";
import dateToString from "@common/utils/dateToString";

const { API_URL } = ENV;
const ERRORS = {
    MISSING_TOKEN: 1,
    EXPIRED_OR_INVALID_TOKEN: 2,
};

/**
 * Transforme récursivement les objets Date en strings YYYY-MM-DD.
 * Cela évite le bug où axios utilise toISOString() qui décale les dates d'un jour
 * (ex: minuit en France = 22h UTC la veille).
 */
function transformDates(data) {
    if (data instanceof Date) {
        return dateToString(data);
    }
    if (Array.isArray(data)) {
        return data.map(transformDates);
    }
    if (data !== null && typeof data === "object") {
        const transformed = {};
        for (const key in data) {
            if (Object.hasOwn(data, key)) {
                transformed[key] = transformDates(data[key]);
            }
        }
        return transformed;
    }
    return data;
}

export const axios = axiosLib.create({
    baseURL: API_URL,
    timeout: 60000,
    headers: {
        "x-app-version": __APP_VERSION__,
    },
    transformRequest: [
        (data) => {
            // Ne transformer que si on a des données et que c'est du JSON
            if (!data) {
                return data;
            }
            // Ne pas transformer si c'est déjà une string (déjà sérialisé) ou FormData
            if (typeof data === "string" || data instanceof FormData) {
                return data;
            }
            // Transformer les dates avant la sérialisation JSON par défaut d'axios
            return transformDates(data);
        },
        ...axiosLib.defaults.transformRequest,
    ],
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
        return response.data;
    },
    (originalError) => {
        let error = originalError.response.data;
        if (!error?.user_message) {
            error = {
                user_message: "Une erreur inconnue est survenue",
                error: originalError,
            };
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
