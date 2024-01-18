import { axios } from "@/helpers/axios";

export function autocomplete(str) {
    return axios.get(
        `/territorial-collectivities/search?query=${encodeURIComponent(str)}`
    );
}
