import { checkActivationToken, activate } from '#helpers/api/user';
import NavBar from '#app/layouts/navbar/navbar.vue';

export default {
    components: {
        NavBar,
    },

    data() {
        return {
            state: null,
            error: null,

            form: {
                loading: false,
                error: null,
                fieldErrors: {},
                input: {
                    password: '',
                },
            },

            userId: null,
        };
    },

    created() {
        this.load();
    },

    methods: {
        /**
         * Tries validating the activation token
         */
        load() {
            // loading data is forbidden if the component is already loading or loaded
            if ([null, 'error'].indexOf(this.state) === -1) {
                return;
            }

            this.state = 'loading';
            this.error = null;

            checkActivationToken(this.$route.params.token)
                .then(({ userId }) => {
                    this.userId = userId;
                    this.state = 'loaded';
                })
                .catch(({ user_message: error }) => {
                    this.error = error;
                    this.state = 'error';
                });
        },

        /**
         * Alias to load(), for better readibility in the view
         *
         * @see load()
         */
        retryLoading() {
            this.load();
        },

        /**
         * Sends an activation request to the API (and handles the response)
         */
        submit() {
            // avoid submitting the form twice at the same time
            if (this.form.loading === true) {
                return;
            }

            this.form.loading = true;
            this.form.error = null;
            this.form.fieldErrors = {};

            activate(this.userId, Object.assign(this.form.input, { token: this.$route.params.token }))
                .then(() => {
                    this.$notify({
                        group: 'notifications',
                        type: 'success',
                        title: 'Compte activé',
                        text: 'Vous pouvez désormais vous connecter à la plateforme',
                    });

                    this.$router.push('/');
                })
                .catch((error) => {
                    this.form.loading = false;
                    this.form.error = error.user_message;
                    this.form.fieldErrors = error.fields || {};
                });
        },
    },
};
