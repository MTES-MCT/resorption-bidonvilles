import NavBar from "#app/layouts/navbar/navbar.vue";

const SLOW_DELAY = 1500;

export default {
    components: {
        NavBar
    },

    props: {
        loader: {
            type: Function,
            required: false
        }
    },

    data() {
        return {
            data: null,
            loading: {
                status: null,
                error: null,
                isSlow: false,
                slowTimeout: null
            }
        };
    },

    mounted() {
        if (this.loader === undefined) {
            this.loading.status = "loaded";
            return;
        }

        this.load();
    },

    methods: {
        load() {
            // ensure we are not already loading or loaded
            if (
                this.loading.status === "loading" ||
                this.loading.status === "loaded"
            ) {
                return;
            }

            // reset loading status
            this.loading.isSlow = false;
            this.loading.status = "loading";
            this.loading.error = null;
            this.loading.slowTimeout = setTimeout(() => {
                this.loading.isSlow = true;
            }, SLOW_DELAY);

            // try loading
            this.loader()
                .then(data => {
                    this.$emit("loaded", data);
                    this.data = data;
                    this.loading.status = "loaded";
                })
                .catch(error => {
                    this.loading.status = "failed";
                    this.loading.error =
                        (error && error.user_message) ||
                        "Une erreur inconnue est survenue";
                })
                .then(() => {
                    clearTimeout(this.loading.slowTimeout);
                    this.loading.slowTimeout = null;
                });
        }
    }
};
