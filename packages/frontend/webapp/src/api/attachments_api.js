import { axios } from "@/helpers/axios";

export function deleteAttachment(attachmentId) {
    return axios.delete(`/attachments/${encodeURI(attachmentId)}`);
}
