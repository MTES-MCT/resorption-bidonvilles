import { postApi } from "#src/js/api";

/**
 * POST /invite
 */
export function invite(data) {
    return postApi("/invite", data);
}

export default invite;
