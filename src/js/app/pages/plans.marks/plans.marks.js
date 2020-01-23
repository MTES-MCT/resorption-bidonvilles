import NavBar from '#app/layouts/navbar/navbar.vue';
import Form from '#app/components/form/form.vue';
import { get, addState } from '#helpers/api/plan';
import { hasPermission, get as getConfig } from '#helpers/api/config';
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
        const { frequence_dechets: frequenceDechets } = getConfig();

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
                            title: 'Public',
                            icon: 'arrow-right',
                            inputs: {
                                audience: {
                                    type: 'audience',
                                    label: 'Public',
                                    mandatory: true,
                                    specificProps: {},
                                    condition({ date }) {
                                        return !!date;
                                    },
                                },
                            },
                        },
                        {
                            title: 'Équipe',
                            icon: 'users',
                            inputs: {
                                etp: {
                                    type: 'etp',
                                    label: 'Équipe',
                                    mandatory: true,
                                    condition({ date }) {
                                        return !!date;
                                    },
                                },
                            },
                        },
                        {
                            title: 'Droit commun et ressources',
                            description: 'Nombre de personnes avec...',
                            icon: 'id-card',
                            inputs: {
                                domiciliation: {
                                    type: 'number',
                                    label: 'une domiciliation',
                                    mandatory: false,
                                    condition({ date }) {
                                        return !!date;
                                    },
                                },
                                droits_caf: {
                                    type: 'number',
                                    label: 'des droits CAF ouverts',
                                    mandatory: false,
                                    condition({ date }) {
                                        return !!date;
                                    },
                                },
                                emploi_stable: {
                                    type: 'number',
                                    label: 'un emploi stable / ressources suffisantes',
                                    mandatory: false,
                                    condition({ date }) {
                                        return !!date;
                                    },
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
                        ame_valide: {
                            type: 'number',
                            label: 'une couverture AME valide',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                        puma_valide: {
                            type: 'number',
                            label: 'une couverture PUMA valide',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                        ame_en_cours: {
                            type: 'number',
                            label: 'une demande AME en cours',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                        puma_en_cours: {
                            type: 'number',
                            label: 'une demande PUMA en cours',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                    },
                },
                {
                    title: '',
                    description: 'Nombre de personnes ayant fait l\'objet d\'au moins',
                    icon: 'user-md',
                    inputs: {
                        orientation: {
                            type: 'number',
                            label: 'une orientation vers une structure de santé',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                        accompagnement: {
                            type: 'number',
                            label: 'un accompagnement physique vers une structure de santé',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                    },
                },
            ],
            school: [{
                title: 'Éducation et scolarisation',
                icon: 'book-reader',
                inputs: {
                    scolarisables: {
                        type: 'number',
                        label: 'Parmi les mineurs, combien sont en âge d\'être scolarisés ?',
                        mandatory: false,
                        condition({ date }) {
                            return !!date;
                        },
                    },
                    maternelles: {
                        type: 'number',
                        label: 'Enfants inscrits en maternelle',
                        mandatory: false,
                        condition({ date }) {
                            return !!date;
                        },
                    },
                    elementaires: {
                        type: 'number',
                        label: 'Enfants inscrits en élémentaire',
                        mandatory: false,
                        condition({ date }) {
                            return !!date;
                        },
                    },
                    colleges: {
                        type: 'number',
                        label: 'Enfants inscrits au collège',
                        mandatory: false,
                        condition({ date }) {
                            return !!date;
                        },
                    },
                    lycees: {
                        type: 'number',
                        label: 'Enfants inscrits au lycée',
                        mandatory: false,
                        condition({ date }) {
                            return !!date;
                        },
                    },
                    difficultes: {
                        type: 'checkbox',
                        label: 'Difficultés éventuelles rencontrées :',
                        mandatory: false,
                        condition({ date }) {
                            return !!date;
                        },
                        options: [
                            { value: 'cantine', label: 'Cantine' },
                            { value: 'place_up2a', label: 'Manque de place en UP2A' },
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
                        pole_emploi: {
                            type: 'number',
                            label: 'Pôle emploi',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                        pole_emploi_femmes: {
                            type: 'number',
                            label: '(dont femmes)',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                        mission_locale: {
                            type: 'number',
                            label: 'Mission locale',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                        mission_locale_femmes: {
                            type: 'number',
                            label: '(dont femmes)',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                    },
                },
                {
                    icon: 'briefcase',
                    description: 'Nombre de personnes ayant',
                    inputs: {
                        contrats: {
                            type: 'number',
                            label: 'un contrat ou une formation',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                        contrats_femmes: {
                            type: 'number',
                            label: '(dont femmes)',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                        autoentrepreneurs: {
                            type: 'number',
                            label: 'un statut autoentrepreneur',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                        autoentrepreneurs_femmes: {
                            type: 'number',
                            label: '(dont femmes)',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                        are: {
                            type: 'number',
                            label: 'l\'ARE',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                        are_femmes: {
                            type: 'number',
                            label: '(dont femmes)',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
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
                        siao: {
                            type: 'number',
                            label: 'SIAO',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                        logement_social: {
                            type: 'number',
                            label: 'logement social',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                        dalo: {
                            type: 'number',
                            label: 'DALO',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                    },
                },
                {
                    icon: 'home',
                    description: 'Nombre de ménages ayant accédé à un logement',
                    inputs: {
                        accompagnes: {
                            type: 'number',
                            label: 'accompagné / adapté',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                        non_accompagnes: {
                            type: 'number',
                            label: 'sans accompagnement (social ou privé)',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                    },
                },
                {
                    icon: 'home',
                    description: 'Nombre de ménages',
                    inputs: {
                        heberges: {
                            type: 'number',
                            label: 'hébergés (hors mise à l\'abri ou hébergement d\'urgence)',
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                        },
                    },
                },
            ],
            safety: [{
                title: 'Stabilisation et sécurisation du site',
                icon: 'seedling',
                inputs: {
                    points_eau: {
                        type: 'number',
                        label: 'Nombre de points d\'eau',
                        mandatory: false,
                        condition({ date }) {
                            return !!date;
                        },
                    },
                    wc: {
                        type: 'number',
                        label: 'Nombre de WC',
                        mandatory: false,
                        condition({ date }) {
                            return !!date;
                        },
                    },
                    douches: {
                        type: 'number',
                        label: 'Nombre de douches',
                        mandatory: false,
                        condition({ date }) {
                            return !!date;
                        },
                    },
                    electricite: {
                        type: 'number',
                        label: 'Nombre d\'accès à l\'électricité',
                        mandatory: false,
                        condition({ date }) {
                            return !!date;
                        },
                    },
                    frequence_dechets: {
                        type: 'select',
                        label: 'Fréquence d\'évacuation des déchets',
                        mandatory: false,
                        condition({ date }) {
                            return !!date;
                        },
                        options: frequenceDechets.map(({ uid, name }) => ({
                            value: uid,
                            label: name,
                        })),
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

                    const audienceSection = this.formDefinition.steps[0].sections.find(({ inputs }) => inputs.audience !== undefined);
                    let lastState = null;

                    if (plan.states.length === 0) {
                        audienceSection.title = 'Qui sont les publics ayant intégré le dispositif ?';
                        audienceSection.description = 'Vous renseignez les indicateurs de suivi pour la première fois. Veuillez porter une attention particulière aux données que vous renseignez ci-dessous : les mises à jour ultérieures seront conditionnées par cette première déclaration.';
                        audienceSection.inputs.audience.specificProps.inOnly = true;
                    } else {
                        [lastState] = plan.states.slice(-1);
                        const dateOfLastState = App.formatDate(lastState.date / 1000, 'd/m/y');

                        if (plan.in_and_out !== true) {
                            audienceSection.title = `Quelles ont été les sorties du dispositif depuis la date du ${dateOfLastState} ?`;
                            audienceSection.description = `Seules les sorties du dispositif sont suivies, car le pilote de l’action au sein des services de l’Etat a renseigné qu’il n’existe pas de système d’entrées et de sorties du dispositif : le dispositif concerne un seul groupe de personne, ayant débuté le projet à la même période.<br/>
                            Attention : le remplissage de ce tableau a un impact sur le nombre de personnes identifiées dans ce dispositif. Merci de le renseigner avec attention`;
                            audienceSection.inputs.audience.specificProps.outOnly = true;
                        } else {
                            audienceSection.title = `Quelles ont été les entrées et sorties du dispositif depuis la date du ${dateOfLastState} ?`;
                            audienceSection.description = `Les entrées et sorties du dispositif sont suivies, car le pilote de l’action au sein des services de l’Etat a renseigné qu’il existe un système d’entrées et de sorties.<br/>
                            Attention : le remplissage de ce tableau a un impact sur le nombre de personnes identifiées dans ce dispositif. Merci de le renseigner avec attention`;
                        }

                        audienceSection.description += `<br/><br/>
                        Au ${dateOfLastState}, date de la dernière mise à jour des informations, sont intégrés dans le dispositif :
                        ${plan.audience.families} ménages, ${plan.audience.total} personnes dont ${plan.audience.women} femmes et ${plan.audience.minors} mineurs
                        `;
                    }

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

                    if (lastState) {
                        this.formData = {
                            domiciliation: lastState.droit_commun ? lastState.droit_commun.domiciliation : 0,
                            droits_caf: lastState.droit_commun ? lastState.droit_commun.droits_caf : 0,
                            emploi_stable: lastState.droit_commun ? lastState.droit_commun.emploi_stable : 0,
                            ame_valide: lastState.sante ? lastState.sante.ame_valide : 0,
                            puma_valide: lastState.sante ? lastState.sante.puma_valide : 0,
                            ame_en_cours: lastState.sante ? lastState.sante.ame_en_cours : 0,
                            puma_en_cours: lastState.sante ? lastState.sante.puma_en_cours : 0,
                            orientation: lastState.sante ? lastState.sante.orientation : 0,
                            accompagnement: lastState.sante ? lastState.sante.accompagnement : 0,
                            scolarisables: lastState.education ? lastState.education.scolarisables : 0,
                            maternelles: lastState.education ? lastState.education.maternelles : 0,
                            elementaires: lastState.education ? lastState.education.elementaires : 0,
                            colleges: lastState.education ? lastState.education.colleges : 0,
                            lycees: lastState.education ? lastState.education.lycees : 0,
                            difficultes: ['cantine', 'place_up2a', 'transport'].filter(d => lastState.education && (lastState.education[`difficulte_${d}`] || lastState.education[`difficculte_${d}`])),
                            pole_emploi: lastState.formation ? lastState.formation.pole_emploi : 0,
                            pole_emploi_femmes: lastState.formation ? lastState.formation.pole_emploi_femmes : 0,
                            mission_locale: lastState.formation ? lastState.formation.mission_locale : 0,
                            mission_locale_femmes: lastState.formation ? lastState.formation.mission_locale_femmes : 0,
                            contrats: lastState.formation ? lastState.formation.contrats : 0,
                            contrats_femmes: lastState.formation ? lastState.formation.contrats_femmes : 0,
                            autoentrepreneurs: lastState.formation ? lastState.formation.autoentrepreneurs : 0,
                            autoentrepreneurs_femmes: lastState.formation ? lastState.formation.autoentrepreneurs_femmes : 0,
                            are: lastState.formation ? lastState.formation.are : 0,
                            are_femmes: lastState.formation ? lastState.formation.are_femmes : 0,
                            siao: lastState.logement ? lastState.logement.siao : 0,
                            logement_social: lastState.logement ? lastState.logement.logement_social : 0,
                            dalo: lastState.logement ? lastState.logement.dalo : 0,
                            accompagnes: lastState.logement ? lastState.logement.accompagnes : 0,
                            non_accompagnes: lastState.logement ? lastState.logement.non_accompagnes : 0,
                            heberges: lastState.logement ? lastState.logement.heberges : 0,
                            points_eau: lastState.logement ? lastState.logement.heberges : 0,
                            wc: lastState.securisation ? lastState.securisation.wc : 0,
                            douches: lastState.securisation ? lastState.securisation.douches : 0,
                            electricite: lastState.securisation ? lastState.securisation.electricite : 0,
                            frequence_dechets: lastState.securisation.frequence_dechets
                                ? lastState.securisation.frequence_dechets.uid
                                : undefined,
                            etp: lastState.etp.map(({ total, type: { uid } }) => ({
                                total,
                                type: uid,
                            })),
                        };
                    }

                    this.formDefinition.title = plan.name;
                    this.plan = plan;
                    this.status = 'loaded';
                })
                .catch((error) => {
                    this.error = error.user_message;
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
