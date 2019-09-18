import NavBar from '#app/layouts/navbar/navbar.vue';
import { create } from '#helpers/api/operator';
import Form from '#app/components/form/form.vue';
import { notify } from '#helpers/notificationHelper';

export default {
    components: {
        NavBar,
        Form,
    },

    data() {
        return {
            formDefinition: {
                title: 'Déclaration d\'un opérateur',
                description: 'Le formulaire ci-dessous concerne uniquement la déclaration d\'opérateurs intervenant sur la question des bidonvilles. Il sera à terme élargi à d\'autres types d\'acteurs, dans la perspective de construction d\'un annuaire partagé.',
                steps: [
                    {
                        title: 'Opérateur',
                        wording: {
                            error: 'La création de l\'opérateur a échoué',
                            submit: 'Créer l\'opérateur',
                        },
                        sections: [
                            {
                                title: 'Caractéristiques de l\'opérateur',
                                inputs: {
                                    name: {
                                        type: 'text',
                                        label: 'Nom de l\'opérateur',
                                        mandatory: true,
                                    },
                                },
                            },
                        ],
                        submit: create,
                    },
                ],
            },
            values: {},
        };
    },

    methods: {
        onComplete() {
            notify({
                group: 'notifications',
                type: 'success',
                title: 'Opérateur créé',
                text: `L'opérateur ${this.values.name} a bien été créé`,
            });

            this.$router.push('/liste-des-operateurs');
        },
    },
};
