import Keycloak from "keycloak-js";
import ENV from "@/helpers/env.js";

const keycloak = new Keycloak({
    url: ENV.KEYCLOAK.URL,
    realm: ENV.KEYCLOAK.REALM,
    clientId: ENV.KEYCLOAK.CLIENT_ID,
});
export default keycloak;
