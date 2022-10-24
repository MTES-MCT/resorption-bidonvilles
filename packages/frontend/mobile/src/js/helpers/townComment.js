import { postApi } from "#src/js/api";

/**
 * POST /towns/:id/comments
 */
export function createComment(shantytownId, comment) {
    return postApi(`/towns/${shantytownId}/comments`, comment);
}
