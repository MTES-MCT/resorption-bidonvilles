import { postApi } from "#helpers/api/main";

/**
 * POST /invite
 */
export function invite(data) {
    return postApi("/invite", data);
}

export default invite;
