import NavBar from "#app/layouts/navbar/navbar.vue";
import Changelog from "#app/components/changelog/changelog.vue";
import { closeChangelog, get as getConfig, load } from "#helpers/api/config";

export default {
    data() {
        const { changelog } = getConfig();

        return {
            error: null,
            changelog
        };
    },
    components: {
        NavBar,
        Changelog
    },
    methods: {
        markChangelogAsRead() {
            closeChangelog(this.changelog.app_version)
                .then(() => {
                    load()
                        .then(() => {
                            this.$router.push("/");
                        })
                        .catch(({ user_message: error }) => {
                            this.error = error;
                        });
                })
                .catch(({ user_message: error }) => {
                    this.error = error;
                });
        }
    }
};
