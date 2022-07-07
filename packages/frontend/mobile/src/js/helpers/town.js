import { getApi } from "../api";

/**
 * GET /towns/findNearby
 */
export function findNearby(latitude, longitude) {
  return getApi(
    `/towns/findNearby?latitude=${latitude}&longitude=${longitude}`
  );
}
