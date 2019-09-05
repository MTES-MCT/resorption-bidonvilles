import NavBar from '#app/layouts/navbar/navbar.vue';
import { isLoaded as isConfigLoaded, load } from '#helpers/api/config';
import { getEntryPoint } from '#app/router';

export default {
    data() {
        return {
            error: null,
        };
    },
    components: {
        NavBar,
    },
    mounted() {
        this.loadConfig();
    },
    methods: {
        loadConfig() {
            if (isConfigLoaded() === true) {
                this.redirect();
            }

            this.error = null;
            load()
                .then(this.redirect)
                .catch((response) => {
                    this.error = response.user_message;
                });
        },
        redirect() {
            this.$router.push(getEntryPoint());
        },
    },
};
