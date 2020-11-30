import { get as getConfig, set as setConfig } from "#helpers/api/config";
import { acceptCharte } from "#helpers/api/user";
import NavBar from "#app/layouts/navbar/navbar.vue";

export default {
    components: {
        NavBar
    },

    data() {
        const {
            user: { id: userId },
            version_charte_engagement: charte
        } = getConfig();

        return {
            user: userId,
            charte,
            data: false,
            form: {
                status: null,
                error: null
            }
        };
    },

    methods: {
        submit() {
            if (this.form.status === "pending") {
                return;
            }

            this.form.status = "pending";
            this.form.error = null;

            acceptCharte(this.user, this.charte.version)
                .then(() => {
                    setConfig("user.charte_engagement_a_jour", true);
                    this.$router.push("/");
                })
                .catch(({ user_message: message }) => {
                    this.form.status = "error";
                    this.form.error = message;
                });
        }
    }
};
