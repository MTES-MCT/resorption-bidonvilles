import NavBar from '#app/layouts/navbar/navbar.vue';
import { isLoaded as isConfigLoaded, load } from '#helpers/configHelper';

export default {
    props: {
        target: String,
    },
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
                return;
            }

            this.error = null;
            load()
                .then(this.redirect)
                .catch((response) => {
                    this.error = response.user_message;
                });
        },
        redirect() {
            this.$router.push(this.target || '/liste-des-sites');
        },
    },
};
