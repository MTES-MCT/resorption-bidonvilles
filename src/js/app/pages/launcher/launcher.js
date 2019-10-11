import NavBar from '#app/layouts/navbar/navbar.vue';
import Changelog from '#app/components/changelog/changelog.vue';
import { isLoaded as isConfigLoaded, load, closeChangelog } from '#helpers/api/config';
import { getEntryPoint } from '#app/router';

export default {
    data() {
        return {
            error: null,
            changelog: null,
        };
    },
    components: {
        NavBar,
        Changelog,
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
            this.changelog = null;
            load()
                .then(({ changelog }) => {
                    if (changelog !== null && changelog !== undefined) {
                        this.changelog = changelog;
                        return;
                    }

                    this.redirect();
                })
                .catch((response) => {
                    this.error = response.user_message;
                });
        },
        markChangelogAsRead() {
            closeChangelog(this.changelog.app_version);
            this.redirect();
        },
        redirect() {
            this.$router.push(getEntryPoint());
        },
    },
};
