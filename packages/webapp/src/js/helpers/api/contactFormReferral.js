import { getApi } from "#helpers/api/main";

export function fetchCSV() {
    return getApi("/contact-form-referrals");
}
