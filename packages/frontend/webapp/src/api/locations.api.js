import { axios } from "@/helpers/axios";
import axiosExternal from "axios";
import ENV from "@/helpers/env.js";

const { ADRESSE_API_URL } = ENV;
const POSTAL_CODE_PATTERN = /^\d{5}$/;

export async function autocomplete(search) {
    const normalizedSearch = (search ?? "").toString().trim();
    if (normalizedSearch.length < 2) {
        return [];
    }

    if (POSTAL_CODE_PATTERN.test(normalizedSearch)) {
        try {
            const { data } = await axiosExternal.get(ADRESSE_API_URL, {
                params: {
                    q: normalizedSearch,
                    type: "municipality",
                },
            });

            const features = Array.isArray(data?.features) ? data.features : [];
            return features.sort((a, b) => {
                const cityA = a?.properties?.city?.toLowerCase() ?? "";
                const cityB = b?.properties?.city?.toLowerCase() ?? "";
                return cityA.localeCompare(cityB);
            });
        } catch {
            return [];
        }
    }

    return axios.get(
        `/locations/search?q=${encodeURIComponent(normalizedSearch)}`
    );
}

export function get(type, code) {
    return axios.get(
        `/locations/${encodeURI(type)}${code ? `/${encodeURI(code)}` : ""}`
    );
}
