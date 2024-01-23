import { axios } from "@/helpers/axios";

export function deleteAttachment(id) {
    return axios.delete(`/attachments/${encodeURI(id)}`);
}
