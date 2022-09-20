import { getApi } from "#src/js/api";

/**
 * GET /towns/actors/user_id
 */
export function findAllByActor(userId) {
  return getApi(`/towns/actors/${userId}`);
}

/**
 * GET /towns/navigation_logs/user_id
 */
export function findByNavigationLog(userId) {
  return getApi(`/towns/navigation_logs/${userId}`);
}
