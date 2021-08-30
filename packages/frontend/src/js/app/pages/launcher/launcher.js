import NavBar from "#app/layouts/navbar/navbar.vue";
import { isLoaded as isConfigLoaded, load, get } from "#helpers/api/config";
import { getEntryPoint } from "#app/guardians";
import * as Sentry from "@sentry/vue";
import { setCustomVariables } from "#matomo/matomo";

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
        console.log('launcher');
        this.loadConfig();
    },
    methods: {
        loadConfig() {
            console.log('loadConfig');
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
            const entrypoint = getEntryPoint()
            this.$router.push(entrypoint.path);
        },
        track(user) {
            Sentry.setUser({ id: user.id });
            setCustomVariables(this.$piwik, user);
        }
    }
};
