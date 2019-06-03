import { get as getConfig } from '#helpers/api/config';
import { create } from '#helpers/api/user';
import NavBar from '#app/layouts/navbar/navbar.vue';
import ActivationLinkModal from '#app/layouts/activationLink/activationLink.vue';
import Form from '#app/components/form/form.vue';

export default {
    components: {
        NavBar,
        ActivationLinkModal,
        Form,
    },

    data() {
        const { roles, departements } = getConfig();

        return {
            /**
             * Form definition
             */
            formDefinition: {
                title: 'Création d\'un nouvel utilisateur',
                description: 'Le formulaire suivant vous permet de créer un compte qui servira d\'accès à la plateforme pour un nouvel utilisateur.',
                steps: [
                    {
                        title: 'Informations personnelles',
                        wording: {
                            submit: 'Créer l\'utiliateur',
                        },
                        sections: [
                            {
                                title: 'Informations personnelles',
                                inputs: {
                                    email: {
                                        type: 'text',
                                        label: 'Adresse email',
                                        mandatory: true,
                                    },
                                    firstName: {
                                        type: 'text',
                                        label: 'Prénom',
                                        mandatory: true,
                                    },
                                    lastName: {
                                        type: 'text',
                                        label: 'Nom de famille',
                                        mandatory: true,
                                    },
                                },
                            },
                            {
                                title: 'Structure d\'appartenance',
                                inputs: {
                                    company: {
                                        type: 'text',
                                        label: 'Structure',
                                        mandatory: true,
                                    },
                                    departement: {
                                        type: 'select',
                                        label: 'Département de rattachement',
                                        mandatory: true,
                                        options: departements.map(({ code, name }) => ({
                                            value: code,
                                            label: `${code} - ${name}`,
                                        })),
                                    },
                                },
                            },
                            {
                                title: 'Droits et permissions',
                                inputs: {
                                    role: {
                                        type: 'radio',
                                        label: 'Rôle',
                                        mandatory: true,
                                        options: roles.map(({ id, name }) => ({
                                            value: id,
                                            label: name,
                                        })),
                                    },
                                    dataOwnerAgreement: {
                                        type: 'checkbox',
                                        label: 'Accord du propriétaire',
                                        mandatory: true,
                                        options: [
                                            {
                                                value: true,
                                                label: 'Je certifie que ces données personnelles ont été saisies avec l\'accord de leur propriétaire',
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        submit: data => create(Object.assign({}, data, {
                            dataOwnerAgreement: data.dataOwnerAgreement[0] || null,
                        })),
                    },
                ],
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
         *
         */
        onComplete({ activationLink }) {
            this.activationLink = activationLink;
        },

        /**
         * Handles a closing of the success modal
         */
        onModalClose() {
            this.$router.push('/liste-des-utilisateurs');
        },
    },
};
