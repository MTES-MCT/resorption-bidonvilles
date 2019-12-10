import NavBar from '#app/layouts/navbar/navbar.vue';
import Form from '#app/components/form/form.vue';
import { get, addState } from '#helpers/api/plan';
import { hasPermission } from '#helpers/api/config';
import { notify } from '#helpers/notificationHelper';

export default {
    components: {
        NavBar,
        Form,
    },

    data() {
        const data = {
            status: null,
            error: null,
            formData: {},
        };

        data.formDefinition = {
            title: '',
            descriptionTitle: 'À quoi sert le suivi ?',
            description: 'Les indicateurs de suivi permettent d’<strong>observer l\'évolution de l\'accès au droit commun et l\'insertion</strong> du groupe de personnes accompagnées. Ces informations facilitent le pilotage local et national.<br/>Dans le cadre des bilans semestriels réalisés par la <a href="https://www.gouvernement.fr/resorption-des-bidonvilles" class="link">Dihal</a>, une actualisation des données est à effectuer <strong>fin juin et fin décembre.</strong>',
            steps: [
                {
                    title: 'Dispositf',
                    wording: {
                        error: 'La déclaration du dispositif a échoué',
                        submit: 'Valider',
                    },
                    sections: [
                        {
                            inputs: {
                                date: {
                                    type: 'date',
                                    label: 'Date d\'actualisation des données',
                                    mandatory: true,
                                },
                            },
                        },
                        {
                            title: 'Équipe',
                            icon: 'users',
                            inputs: {
                                etp: {
                                    type: 'etp',
                                    label: '',
                                    mandatory: true,
                                },
                            },
                        },
                        {
                            title: 'Public',
                            icon: 'arrow-right',
                            inputs: {
                                audience: {
                                    type: 'audience',
                                    label: '',
                                    mandatory: true,
                                },
                            },
                        },
                        {
                            title: 'Droit commun et ressources',
                            description: 'Nombre de personnes avec...',
                            icon: 'id-card',
                            inputs: {
                                housing: {
                                    type: 'number',
                                    label: 'une domiciliation',
                                    mandatory: false,
                                },
                                caf: {
                                    type: 'number',
                                    label: 'des droits CAF ouverts',
                                    mandatory: false,
                                },
                                job: {
                                    type: 'number',
                                    label: 'un emploi stable / ressources suffisantes',
                                    mandatory: false,
                                },
                            },
                        },
                    ],
                    submit: d => addState(this.$route.params.id, d),
                },
            ],
        };

        data.varyingSections = {
            health: [
                {
                    title: 'Santé',
                    description: 'Nombre de personnes avec...',
                    icon: 'user-md',
                    inputs: {
                        granted_ame: {
                            type: 'number',
                            label: 'une couverture AME valide',
                            mandatory: false,
                        },
                        granted_puma: {
                            type: 'number',
                            label: 'une couverture PUMA valide',
                            mandatory: false,
                        },
                        requesting_ame: {
                            type: 'number',
                            label: 'une demande AME en cours',
                            mandatory: false,
                        },
                        requesting_puma: {
                            type: 'number',
                            label: 'une demande PUMA en cours',
                            mandatory: false,
                        },
                    },
                },
                {
                    title: '',
                    description: 'Nombre de personnes ayant fait l\'objet d\'au moins',
                    icon: 'user-md',
                    inputs: {
                        verbally_redirected: {
                            type: 'number',
                            label: 'une orientation vers une structure de santé',
                            mandatory: false,
                        },
                        physically_redirected: {
                            type: 'number',
                            label: 'un accompagnement physique vers une structure de santé',
                            mandatory: false,
                        },
                    },
                },
            ],
            school: [{
                title: 'Éducation et scolarisation',
                icon: 'book-reader',
                inputs: {
                    can_be_schooled: {
                        type: 'number',
                        label: 'Parmi les mineurs, combien sont en âge d\'être scolarisés ?',
                        mandatory: false,
                    },
                    children_signed_to_maternelle: {
                        type: 'number',
                        label: 'Enfants inscrits en maternelle',
                        mandatory: false,
                    },
                    children_signed_to_elementaire: {
                        type: 'number',
                        label: 'Enfants inscrits en élémentaire',
                        mandatory: false,
                    },
                    children_signed_to_college: {
                        type: 'number',
                        label: 'Enfants inscrits au collège',
                        mandatory: false,
                    },
                    children_signed_to_lycee: {
                        type: 'number',
                        label: 'Enfants inscrits au lycée',
                        mandatory: false,
                    },
                    issues: {
                        type: 'checkbox',
                        label: 'Difficultés éventuelles rencontrées :',
                        mandatory: false,
                        options: [
                            { value: 'cantine', label: 'Cantine' },
                            { value: 'up2a', label: 'Manque de place en UP2A' },
                            { value: 'transport', label: 'Transport' },
                        ],
                    },
                },
            }],
            work: [
                {
                    title: 'Formation et emploi',
                    icon: 'briefcase',
                    description: 'Nombre de personnes inscrites ou suivies par',
                    inputs: {
                        pole_emploi_total: {
                            type: 'number',
                            label: 'Pôle emploi',
                            mandatory: false,
                        },
                        pole_emploi_women: {
                            type: 'number',
                            label: '(dont femmes)',
                            mandatory: false,
                        },
                        mission_locale_total: {
                            type: 'number',
                            label: 'Mission locale',
                            mandatory: false,
                        },
                        mission_locale_women: {
                            type: 'number',
                            label: '(dont femmes)',
                            mandatory: false,
                        },
                    },
                },
                {
                    icon: 'briefcase',
                    description: 'Nombre de personnes ayant',
                    inputs: {
                        contract_total: {
                            type: 'number',
                            label: 'un contrat ou une formation',
                            mandatory: false,
                        },
                        contract_women: {
                            type: 'number',
                            label: '(dont femmes)',
                            mandatory: false,
                        },
                        autoentrepreneur_total: {
                            type: 'number',
                            label: 'un statut autoentrepreneur',
                            mandatory: false,
                        },
                        autoentrepreneur_women: {
                            type: 'number',
                            label: '(dont femmes)',
                            mandatory: false,
                        },
                        are_total: {
                            type: 'number',
                            label: 'l\'ARE',
                            mandatory: false,
                        },
                        are_women: {
                            type: 'number',
                            label: '(dont femmes)',
                            mandatory: false,
                        },
                    },
                },
            ],
            housing: [
                {
                    title: 'Logement',
                    icon: 'home',
                    description: 'Nombre de ménages ayant fait une demande',
                    inputs: {
                        requested_siao: {
                            type: 'number',
                            label: 'SIAO',
                            mandatory: false,
                        },
                        requested_social: {
                            type: 'number',
                            label: 'logement social',
                            mandatory: false,
                        },
                        requested_dalo: {
                            type: 'number',
                            label: 'DALO',
                            mandatory: false,
                        },
                    },
                },
                {
                    icon: 'home',
                    description: 'Nombre de ménages ayant accédé à un logement',
                    inputs: {
                        housed_with_help: {
                            type: 'number',
                            label: 'accompagné / adapté',
                            mandatory: false,
                        },
                        housed_without_help: {
                            type: 'number',
                            label: 'sans accompagnement (social ou privé)',
                            mandatory: false,
                        },
                    },
                },
                {
                    icon: 'home',
                    description: 'Nombre de ménages',
                    inputs: {
                        hosted: {
                            type: 'number',
                            label: 'hébergés (hors mise à l\'abri ou hébergement d\'urgence)',
                            mandatory: false,
                        },
                    },
                },
            ],
            safety: [{
                title: 'Stabilisation et sécurisation du site',
                icon: 'seedling',
                inputs: {
                    water: {
                        type: 'number',
                        label: 'Nombre de points d\'eau',
                        mandatory: false,
                    },
                    toilets: {
                        type: 'number',
                        label: 'Nombre de WC',
                        mandatory: false,
                    },
                    bath: {
                        type: 'number',
                        label: 'Nombre de douches',
                        mandatory: false,
                    },
                    electricity: {
                        type: 'number',
                        label: 'Nombre d\'accès à l\'électricité',
                        mandatory: false,
                    },
                    trash_frequency: {
                        type: 'select',
                        label: 'Fréquence d\'évacuation des déchets',
                        mandatory: false,
                        options: [
                            { value: 'every_day', label: 'Tous les jours' },
                            { value: 'several_times_a_week', label: 'Plusieurs fois par semaine' },
                            { value: 'every_week', label: 'Toutes les semaines' },
                            { value: 'less_than_once_a_week', label: 'Moins d\'une fois par semaine' },
                        ],
                    },
                },
            }],
        };

        return data;
    },

    created() {
        this.load();
    },

    methods: {
        hasPermission,
        load() {
            if (['loading', 'loaded'].indexOf(this.status) !== -1) {
                return;
            }

            this.status = 'loading';
            this.error = null;

            get(this.$route.params.id)
                .then((plan) => {
                    plan.topics.forEach(({ uid }) => {
                        if (!this.varyingSections[uid]) {
                            return;
                        }

                        this.varyingSections[uid].forEach((section) => {
                            this.formDefinition.steps[0].sections.push(section);
                        });
                    });

                    if (plan.audience && plan.audience.length > 0) {
                        const inputs = {
                            team: ['etp'],
                            common_rights: ['housing', 'caf', 'job'],
                            healthcare: ['granted_ame', 'granted_puma', 'requesting_ame', 'requesting_puma', 'verbally_redirected', 'physically_redirected'],
                            schooling: ['can_be_schooled', 'children_signed_to_maternelle', 'children_signed_to_elementaire', 'children_signed_to_college', 'children_signed_to_lycee', 'issues'],
                            job: ['pole_emploi_total', 'mission_locale_total', 'contract_total', 'autoentrepreneur_total', 'are_total', 'pole_emploi_women', 'mission_locale_women', 'contract_women', 'autoentrepreneur_women', 'are_women'],
                            housing: ['requested_siao', 'requested_social', 'requested_dalo', 'housed_with_help', 'housed_without_help', 'hosted'],
                            safety: ['water', 'toilets', 'bath', 'electricity', 'trash_frequency'],
                        };
                        Object.keys(inputs).forEach((category) => {
                            if (plan[category] && plan[category].length > 0) {
                                inputs[category].forEach((field) => {
                                    this.formData[field] = plan[category].slice(-1)[0][field];
                                });
                            }
                        });
                    }

                    this.formDefinition.title = plan.name;
                    this.plan = plan;
                    this.status = 'loaded';
                })
                .catch(({ user_message: message }) => {
                    this.error = message;
                    this.status = 'loadingError';
                });
        },
        onComplete() {
            notify({
                group: 'notifications',
                type: 'success',
                title: 'Indicateurs correctement enregistrés',
                text: 'Le dispositif a bien mis à jour',
            });

            this.$router.push(`/dispositif/${this.$route.params.id}`);
        },
    },
};
