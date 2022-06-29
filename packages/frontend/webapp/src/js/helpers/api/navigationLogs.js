import { postApi } from "#src/js/api";

/**
 * POST /me/navigationLogs
 */
export function insert(page) {
    return postApi("/me/navigationLogs", { page });
}
