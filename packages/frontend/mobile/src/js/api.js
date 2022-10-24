import { createApi } from "#frontend/common/api/main";
import { APP_VERSION, VUE_APP_MOBILE_API_HOST } from "#src/env";

const api = createApi(`https://${VUE_APP_MOBILE_API_HOST}`, APP_VERSION);
export default api;

const { getApi, postApi, patchApi, putApi, deleteApi, open } = api;
export { getApi, postApi, patchApi, putApi, deleteApi, open };
