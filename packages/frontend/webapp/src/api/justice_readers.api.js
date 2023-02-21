import { axios } from "@/helpers/axios";

export function get(locationType, locationCode) {
    return axios.get(
        `/justice-readers/${encodeURI(locationType)}/${encodeURI(locationCode)}`
    );
}
