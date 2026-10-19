import Keycloak from "keycloak-js";
import ENV from "@/helpers/env.js";

const keycloak = new Keycloak({
    url: ENV.KEYCLOAK.URL + "/auth", // TODO: supprimer /auth quand SISIAO passera en Keycloak v18
    realm: ENV.KEYCLOAK.REALM,
    clientId: ENV.KEYCLOAK.CLIENT_ID,
});
export default keycloak;
