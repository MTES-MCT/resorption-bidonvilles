import { createApi } from "#frontend/common/api/main";
import ENV from "#src/env.js";

const api = createApi(`https://${ENV.VITE_MOBILE_API_HOST}`, __APP_VERSION__);
export default api;

const { getApi, postApi, patchApi, putApi, deleteApi, open } = api;
export { getApi, postApi, patchApi, putApi, deleteApi, open };
