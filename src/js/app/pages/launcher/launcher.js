import NavBar from "#app/layouts/navbar/navbar.vue";
import { isLoaded as isConfigLoaded, load, get } from "#helpers/api/config";
import { getEntryPoint } from "#app/router";

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
                .then(() => {
                    this.redirect();
                })
                .catch(response => {
                    this.error = response.user_message;
                });
        },
        redirect() {
            const { user } = get();
            this.track(user);
            this.$router.push(getEntryPoint());
        },
        track(user) {
            if (!this.$piwik) {
                return;
            }

            this.$piwik.setUserId(user.id);
            this.$piwik.setCustomVariable(1, "superuser", user.is_superuser);
            this.$piwik.setCustomVariable(
                2,
                "structure",
                user.organization.type.abbreviation ||
                    user.organization.type.name_singular
            );
            this.$piwik.setCustomVariable(
                3,
                "niveau_geo",
                user.organization.location.type
            );
            this.$piwik.setCustomVariable(
                4,
                "geo_nom",
                user.organization.location[user.organization.location.type]
                    ? user.organization.location[
                          user.organization.location.type
                      ].name
                    : null
            );
        }
    }
};
