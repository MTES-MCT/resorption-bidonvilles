import { VueGoodTable as Table } from "vue-good-table";
import { get, sendActivationLink, denyAccess, remove } from "#helpers/api/user";
import UserPermissions from "#app/layouts/userPermissions/userPermissions.vue";
import "vue-good-table/dist/vue-good-table.css";
import NavBar from "#app/layouts/navbar/navbar.vue";
import { get as getConfig } from "#helpers/api/config";
import { notify } from "#helpers/notificationHelper";

let permissions;

export default {
    components: {
        NavBar,
        Table,
        UserPermissions
    },

    data() {
        let activationTokenExpiresIn;
        ({
            permissions_description: permissions,
            activation_token_expires_in: activationTokenExpiresIn
        } = getConfig());

        return {
            /**
             * @type {User}
             */
            user: null,

            /**
             * The error's user message
             *
             * Obivously, null if there is no error
             *
             * @type {string|null}
             */
            error: null,

            /**
             * The current state of the page
             *
             * One out of: 'loading', 'error', or 'loaded'
             *
             * @type {string|null}
             */
            state: null,

            /**
             * Wether an activation link is being generated for one of the users
             *
             * @type {boolean}
             */
            loading: false,

            /**
             * Validation state
             *
             * @type {Object}
             */
            validation: {
                state: null,
                error: null
            },

            /**
             * List of checked options
             *
             * @type {Object.<String,Boolean>}
             */
            checkedOptions: {},

            /**
             * Number of days of validity of an activation days
             *
             * @type {Number}
             */
            tokenExpiresIn: activationTokenExpiresIn / 3600 / 24
        };
    },

    computed: {
        /**
         * Details about the permissions requested by the user
         *
         * @returns {Object}
         */
        permission() {
            if (!this.user) {
                return null;
            }

            return permissions[this.user.role_id];
        },

        /**
         * Get the allowed options for the current user
         *
         * @returns {Array}
         */
        options() {
            if (this.user === null || !this.permission) {
                return [];
            }

            return this.permission.options;
        },

        /**
         * Indicates whether the activation link is now expired
         *
         * @returns {Boolean}
         */
        isExpired() {
            const now = Date.now();
            return (
                this.user !== null &&
                this.user.status !== "active" &&
                this.user.activation_link_expires_on !== null &&
                now - this.user.activation_link_expires_on * 1000 > 0
            );
        }
    },

    created() {
        this.load();
    },

    methods: {
        formatDate(...args) {
            return App.formatDate.call(App, ...args);
        },

        /**
         * Tries fetching the data from the API
         *
         * Please note that this cannot be done if the data has already been loaded
         * before.
         */
        load() {
            // loading data is forbidden if the component is already loading or loaded
            if ([null, "error"].indexOf(this.state) === -1) {
                return;
            }

            this.state = "loading";
            this.error = null;

            get(this.$route.params.id)
                .then(user => {
                    this.user = user;
                    this.checkedOptions = this.options.reduce(
                        (acc, option) =>
                            Object.assign(acc, {
                                [option.id]:
                                    user.permission_options.indexOf(
                                        option.id
                                    ) !== -1
                            }),
                        {}
                    );

                    this.state = "loaded";
                })
                .catch(({ user_message: error }) => {
                    this.error = error;
                    this.state = "error";
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
         * Checks whether the user requires at least one permission for the given level
         *
         * @param {'national'|'local'} level
         *
         * @returns {Boolean}
         */
        hasPermissionsFor(level) {
            return (
                this.permission &&
                this.permission[`${level}_permissions`] &&
                this.permission[`${level}_permissions`].length > 0
            );
        },

        /**
         * Allows access to the user
         */
        validate() {
            if (this.validation.state === "loading") {
                return;
            }

            this.validation.state = "loading";
            this.validation.error = null;

            sendActivationLink(this.$route.params.id, {
                options: this.checkedOptions
            })
                .then(() => {
                    this.validation.state = null;

                    notify({
                        group: "notifications",
                        type: "success",
                        title: "Accès envoyé",
                        text: "Un accès a été envoyé à l'utilisateur"
                    });

                    this.$router.push("/liste-des-utilisateurs");
                })
                .catch(({ user_message: error }) => {
                    this.validation.state = null;
                    this.validation.error = error;
                });
        },

        /**
         * Denies access to the user
         */
        deny() {
            if (this.validation.state === "loading") {
                return;
            }

            this.validation.state = "loading";
            this.validation.error = null;

            denyAccess(this.$route.params.id)
                .then(() => {
                    this.validation.state = null;

                    notify({
                        group: "notifications",
                        type: "success",
                        title: "Accès refusé",
                        text: "L'utilisateur a été supprimé de la base"
                    });

                    this.$router.push("/liste-des-utilisateurs");
                })
                .catch(({ user_message: error }) => {
                    this.validation.state = null;
                    this.validation.error = error;
                });
        },

        /**
         *
         */
        remove() {
            if (this.validation.state === "loading") {
                return;
            }

            // eslint-disable-next-line no-alert
            if (
                !window.confirm(
                    "Êtes-vous sûr de vouloir supprimer cet accès ?"
                )
            ) {
                return;
            }

            this.validation.state = "loading";
            this.validation.error = null;

            remove(this.$route.params.id)
                .then(() => {
                    this.validation.state = null;

                    notify({
                        group: "notifications",
                        type: "success",
                        title: "Accès supprimé",
                        text: "L'utilisateur a été supprimé de la base"
                    });

                    this.$router.push("/liste-des-utilisateurs");
                })
                .catch(({ user_message: error }) => {
                    this.validation.state = null;
                    this.validation.error = error;
                });
        }
    }
};
