import { axios } from "@/helpers/axios";

export function exportList() {
    return axios.get("/contact-form-referrals");
}
