import NavBar from '#app/layouts/navbar/navbar.vue';
import Form from '#app/components/form/form.vue';
import { get as getConfig } from '#helpers/api/config';
import { create } from '#helpers/api/plan';
import { notify } from '#helpers/notificationHelper';

export default {
    components: {
        NavBar,
        Form,
    },

    data() {
        const {
            plan_types: planTypes,
            departements,
            user: {
                organization: {
                    location: {
                        departement,
                    },
                },
            },
        } = getConfig();

        const data = {
            formData: {
                departement: departement !== null ? departement.code : null,
            },
        };

        data.formDefinition = {
            title: 'Déclaration d\'un dispositif',
            description: 'Ce formulaire vous permet de déclarer un dispositif ou une action menée sur votre territoire. Il peut s\'agir notamment d\'actions d\'accompagnement social global, d\'espaces temporaires d\'insertion ou encore d\'actions sanitaires (déployés sur un ou plusieurs bidonville ou "hors les murs"). Une fois ce formulaire validé, ledispositif fera l\'objet d\'une fiche dédiée, accessible via l\'onglet "liste des dispositifs". Lorsque le symbole (*) apparaît en rouge au début de l\'intitulé de la question, cela signifie qu\'il s\'agit d\'une question obligatoire. Il n\'est pas possible de valider le formulaire sans y avoir répondu.',
            steps: [
                {
                    title: 'Dispositf',
                    wording: {
                        error: 'La déclaration du dispositif a échoué',
                        submit: 'Déclarer le dispositif',
                    },
                    sections: [
                        {
                            title: 'Caractéristiques générales',
                            inputs: {
                                name: {
                                    type: 'text',
                                    label: 'Nom du dispositif',
                                    mandatory: false,
                                },
                                type: {
                                    type: 'radio',
                                    label: 'Type de dispositif',
                                    mandatory: true,
                                    options: planTypes.map(({ id, label }) => ({
                                        value: id,
                                        label,
                                    })),
                                },
                                startedAt: {
                                    type: 'date',
                                    label: 'Date de début du dispositif',
                                    mandatory: true,
                                },
                            },
                        },
                        {
                            title: 'Sites concernés',
                            inputs: {
                                departement: {
                                    type: 'select',
                                    label: 'Département concerné',
                                    mandatory: true,
                                    options: departements.map(({ code, name }) => ({
                                        value: code,
                                        label: `${code} - ${name}`,
                                    })),
                                },
                                targetedOnTowns: {
                                    type: 'radio',
                                    label: 'L\'action est menée sur un ou plusieurs site(s) en particulier :',
                                    mandatory: true,
                                    options: [
                                        { value: false, label: 'Non' },
                                        { value: true, label: 'Oui' },
                                    ],
                                },
                                towns: {
                                    type: 'townList',
                                    label: 'Sites concernés',
                                    mandatory: false,
                                    specificProps: {
                                        filter: ({ departement: { code } }) => code === this.formData.departement,
                                    },
                                    condition({ targetedOnTowns }) {
                                        return targetedOnTowns;
                                    },
                                },
                            },
                        },
                        {
                            title: 'Financements',
                            inputs: {
                                funding: {
                                    type: 'planFunding',
                                    label: 'Financements 2019',
                                    description: 'Ce tableau de financement ne concerne que l\'année courante',
                                    mandatory: false,
                                },
                            },
                        },
                    ],
                    submit: d => create(Object.assign({}, d, {
                        ngo: d.ngo && d.ngo.length ? d.ngo[0].id : null,
                    })),
                },
            ],
        };

        return data;
    },

    watch: {
        'formData.departement': function a() {
            this.$refs.form.getInputById('towns').specificProps.filter = ({ departement: { code } }) => code === this.formData.departement;
        },
    },

    methods: {
        onComplete() {
            notify({
                group: 'notifications',
                type: 'success',
                title: 'Dispositif correctement déclaré',
                text: 'Le dispositif a bien été ajouté en base de données',
            });

            this.$router.push('/liste-des-dispositifs');
        },
    },
};
