import { get as getConfig } from '#helpers/api/config';
import { create } from '#helpers/api/user';
import NavBar from '#app/layouts/navbar/navbar.vue';
import ActivationLinkModal from '#app/layouts/activationLink/activationLink.vue';

export default {
    components: {
        NavBar,
        ActivationLinkModal,
    },

    data() {
        const { roles, departements } = getConfig();

        return {
            /**
             * Wheter a creation request is in progress or not
             *
             * @type {boolean}
             */
            loading: false,

            /**
             * User error message, if any
             *
             * @type {string|null}
             */
            error: null,

            /**
             * List of errors, field by field
             *
             * @type {Object.<string,Array.<string>>}
             */
            fieldErrors: {},

            /**
             * List of departements
             *
             * @type {Array.<Departement>}
             */
            departements,

            /**
             * List of roles
             *
             * @type {Array.<Role>}
             */
            roles,

            /**
             * Inputs
             *
             * @type {Object.<string,string>}
             */
            input: {
                email: '',
                firstName: '',
                lastName: '',
                company: '',
                departement: undefined,
                role: undefined,
                dataOwnerAgreement: false,
            },

            /**
             * The activation link for the newly created user
             *
             * @type {string|null}
             */
            activationLink: null,
        };
    },

    methods: {
        /**
         * Sends a creation request to the API (and handles the response)
         */
        submit() {
            // avoid submitting the form twice at the same time
            if (this.loading === true) {
                return;
            }

            this.loading = true;
            this.error = null;
            this.fieldErrors = {};

            create(this.input)
                .then(({ activationLink }) => {
                    this.activationLink = activationLink;
                })
                .catch((error) => {
                    this.loading = false;
                    this.error = error.user_message;
                    this.fieldErrors = error.fields || {};
                });
        },

        /**
         * Handles a closing of the success modal
         */
        onModalClose() {
            this.$router.push('/liste-des-utilisateurs');
        },
    },
};
