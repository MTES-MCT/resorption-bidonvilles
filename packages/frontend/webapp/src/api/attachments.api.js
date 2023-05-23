export function deleteAttachment(attachmentId) {
    return this.$axios.delete(`/attachments/${attachmentId}`);
}
