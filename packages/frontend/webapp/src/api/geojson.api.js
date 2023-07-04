import { axios } from "@/helpers/axios";

export function departement(code) {
    return axios.get(
        `/assets/geojson/departements/${encodeURIComponent(code)}.json`
    );
}
