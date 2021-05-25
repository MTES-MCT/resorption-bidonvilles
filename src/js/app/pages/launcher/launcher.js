import NavBar from "#app/layouts/navbar/navbar.vue";
import { isLoaded as isConfigLoaded, load, get } from "#helpers/api/config";
import { getEntryPoint } from "#app/router";
import * as Sentry from "@sentry/vue";

export default {
    data() {
        return {
            error: null
        };
    },
    components: {
        NavBar
    },
    mounted() {
        this.loadConfig();
    },
    methods: {
        loadConfig() {
            if (isConfigLoaded() === true) {
                this.redirect();
                return;
            }

            this.error = null;
            load()
                .catch(response => {
                    console.log("Error while loading", response);
                    this.error = response.user_message;
                })
                .then(() => {
                    this.redirect();
                });
        },
        redirect() {
            const { user } = get();
            this.track(user);
            this.$router.push(getEntryPoint());
        },
        track(user) {
            Sentry.setUser({ id: user.id });

            if (!this.$piwik) {
                return;
            }

            this.$piwik.setUserId(user.id);

            const location =
                user.organization.location[user.organization.location.type];

            // Convert user's data to a easily parsable string:
            // ie: superuser:false,is_admin:false,role:association,org_category:association,org_location_type:departement,org_location_name:Gironde,org_location_code:33
            const userData = JSON.stringify({
                superuser: user.is_superuser,
                is_admin: user.is_admin,
                role: user.role_id,
                org_category: user.organization.category.uid,
                org_location_type: user.organization.location.type,
                org_location_name: location?.name,
                org_location_code: location?.code
            })
                .replaceAll('"', "")
                .replaceAll("{", "")
                .replaceAll("}", "");

            this.$piwik.setCustomVariable(1, "user", userData);

            const departement = user.organization.location.departement || null;
            this.$piwik.setCustomVariable(
                5,
                "departement_code",
                departement ? departement.code : null
            );
        }
    }
};
