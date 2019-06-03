import { list, generateActivationLink } from '#helpers/api/user';
import { VueGoodTable as Table } from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css';
import NavBar from '#app/layouts/navbar/navbar.vue';
import Modal from '#app/components/modal/modal.vue';
import ActivationLinkModal from '#app/layouts/activationLink/activationLink.vue';

export default {
    components: {
        NavBar,
        Table,
        Modal,
        ActivationLinkModal,
    },

    data() {
        return {
            /**
             * List of users
             *
             * @type {Array.<User>}
             */
            users: [],

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
             * The generated activation link, if any
             *
             * @type {string|null}
             */
            activationLink: null,

            /**
             * The error obtained while trying to generate an activation link
             *
             * @type {string|null}
             */
            activationLinkError: null,
        };
    },

    computed: {
        tableProperties() {
            return {
                columns: [
                    {
                        id: 'email',
                        label: 'Email',
                        field: 'email',
                    },
                    {
                        id: 'active',
                        label: 'Compte activé',
                        field: user => (user.active ? 'oui' : 'non'),
                    },
                    {
                        id: 'activationLink',
                        label: 'Générer un lien d\'activation',
                        field: () => '', // please see the custom row template (in users.list.pug)
                    },
                ],
                rows: this.users,
                'sort-options': {
                    enabled: true,
                },
            };
        },
    },

    created() {
        this.load();
    },

    methods: {
        /**
         * Tries fetching the data from the API
         *
         * Please note that this cannot be done if the data has already been loaded
         * before.
         */
        load() {
            // loading data is forbidden if the component is already loading or loaded
            if ([null, 'error'].indexOf(this.state) === -1) {
                return;
            }

            this.state = 'loading';
            this.error = null;

            list()
                .then((users) => {
                    this.users = users;
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
         * Fetches an activation link for the given user, and then displays it
         *
         * @param {User} user
         */
        generateActivationLink(user) {
            // avoid generating two links at the same time
            if (this.loading === true) {
                return;
            }

            // eslint-disable-next-line
            user.loading = true;
            this.loading = true;

            generateActivationLink(user)
                .then(({ activationLink: link }) => {
                    // eslint-disable-next-line
                    user.loading = false;
                    this.loading = false;

                    this.activationLink = link;
                })
                .catch(({ user_message: error }) => {
                    // eslint-disable-next-line
                    user.loading = false;
                    this.loading = false;

                    this.activationLinkError = error;
                });
        },

        /**
         * Deactivates a user, and then fetches an activation link
         *
         * @param {User} user
         */
        regenerateActivationLink(user) {
            // avoid generating two links at the same time
            if (this.loading === true) {
                return;
            }

            // eslint-disable-next-line
            user.loading = true;
            this.loading = true;

            generateActivationLink(user)
                .then(({ activationLink: link }) => {
                    // eslint-disable-next-line
                    user.loading = false;
                    this.loading = false;

                    this.activationLink = link;
                })
                .catch(({ user_message: error }) => {
                    // eslint-disable-next-line
                    user.loading = false;
                    this.loading = false;

                    this.activationLinkError = error;
                });
        },

        /**
         * Handles the closing of the activation link modal
         */
        onActivationLinkClose() {
            this.activationLink = null;
        },

        /**
         * Handles the closing of the activation link error modal
         */
        onActivationLinkErrorClose() {
            this.activationLinkError = null;
        },
    },
};
