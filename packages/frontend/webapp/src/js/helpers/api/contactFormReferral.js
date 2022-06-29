import { getApi } from "#src/js/api";

export function fetchCSV() {
    return getApi("/contact-form-referrals");
}
