import { getApi } from "#src/js/api";

/**
 * GET /towns/actors/user_id
 */
export function findAllByActor(userId) {
  return getApi(`/towns/actors/${userId}`);
}
