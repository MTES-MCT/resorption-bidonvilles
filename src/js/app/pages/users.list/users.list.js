import { VueGoodTable as Table } from 'vue-good-table';
import { list } from '#helpers/api/user';
import 'vue-good-table/dist/vue-good-table.css';
import NavBar from '#app/layouts/navbar/navbar.vue';
import Modal from '#app/components/modal/modal.vue';
import { get as getConfig } from '#helpers/api/config';
import { open } from '#helpers/tabHelper';

export default {
    components: {
        NavBar,
        Table,
        Modal,
    },

    data() {
        const { token_expires_in: tokenExpiresIn } = getConfig();

        return {
            /**
             * Duration of validity of an activation token (in seconds)
             *
             * @type {Number}
             */
            tokenExpiresIn,

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
        };
    },

    computed: {
        tableProperties() {
            return {
                columns: [
                    {
                        id: 'lastName',
                        label: 'NOM',
                        field: user => user.last_name.toUpperCase(),
                    },
                    {
                        id: 'firstName',
                        label: 'PRÉNOM',
                        field: 'first_name',
                    },
                    {
                        id: 'organization',
                        label: 'STRUCTURE',
                        field: 'organization.name',
                    },
                    {
                        id: 'location',
                        label: 'TERRITOIRE',
                        field: (user) => {
                            if (user.organization.location.type === 'nation') {
                                return 'National';
                            }

                            const location = user.organization.location[user.organization.location.type];
                            if (!location) {
                                return '';
                            }

                            if (user.organization.location.type === 'departement') {
                                return `${location.name} (${location.code})`;
                            }

                            return location.name;
                        },
                    },
                    {
                        id: 'role',
                        label: 'TYPE D\'ACCÈS',
                        field: 'role',
                    },
                    {
                        id: 'status',
                        label: 'STATUT DU COMPTE',
                        field: (user) => {
                            if (user.status === 'active') {
                                if (user.role_id === 'local_admin') {
                                    return {
                                        icon: 'user-shield',
                                        label: '<strong>Administrateur local</strong>',
                                    };
                                }

                                if (user.role_id === 'national_admin') {
                                    return {
                                        icon: 'user-shield',
                                        label: '<strong>Administrateur national</strong>',
                                    };
                                }

                                return {
                                    icon: 'user-check',
                                    label: `<strong>Compte activé</strong> le ${App.formatDate(user.activated_on, 'd M y')}`,
                                };
                            }

                            if (user.last_activation_link_sent_on !== null) {
                                if (Date.now() - (user.activation_link_expires_on * 1000) >= 0) {
                                    return {
                                        icon: 'unlink',
                                        label: `<strong>Lien expiré</strong> le ${App.formatDate(user.activation_link_expires_on, 'd M y')}`,
                                    };
                                }

                                return {
                                    icon: 'paper-plane',
                                    label: `<strong>Accès envoyé</strong> le ${App.formatDate(user.last_activation_link_sent_on, 'd M y')}`,
                                };
                            }

                            return {
                                icon: 'flag',
                                label: `<strong>Demandé</strong> le ${App.formatDate(user.created_at, 'd M y')}`,
                            };
                        },
                    },
                    {
                        id: 'validate',
                        label: '',
                        field: () => true,
                    },
                ],
                rows: this.users,
                'row-style-class': row => (row.status !== 'active' && row.last_activation_link_sent_on === null ? 'user user--highlight' : 'user'),
                'sort-options': {
                    enabled: true,
                },
                'search-options': {
                    enabled: true,
                    placeholder: 'Rechercher par utilisateur, structure, territoire, ou type d\'accès',
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
                    this.users = users.filter(({ status }) => status !== 'inactive');
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
         *
         */
        routeToUserValidation(params) {
            const routeData = this.$router.resolve(`/nouvel-utilisateur/${params.row.id}`);
            open(routeData.href);
        },
    },
};
