import NavBar from "#app/layouts/navbar/navbar.vue";
import Form from "#app/components/form/form.vue";
import { get, addState } from "#helpers/api/plan";
import { hasPermission } from "#helpers/api/config";
import { notify } from "#helpers/notificationHelper";

export default {
    components: {
        NavBar,
        Form
    },

    data() {
        const data = {
            status: null,
            error: null,
            formData: {}
        };

        data.formDefinition = {
            title: "",
            descriptionTitle: "À quoi sert le suivi ?",
            description:
                "Les indicateurs de suivi permettent d’<strong>observer l'évolution de l'accès au droit commun et l'insertion</strong> du groupe de personnes accompagnées. Ces informations facilitent le pilotage local et national.",
            steps: [
                {
                    title: "Dispositf",
                    wording: {
                        error: "La déclaration du dispositif a échoué",
                        submit: "Valider"
                    },
                    sections: [
                        {
                            inputs: {
                                date: {
                                    type: "date",
                                    label: "Date d'actualisation des données",
                                    mandatory: true
                                }
                            }
                        },
                        {
                            title: "Public",
                            icon: "arrow-right",
                            inputs: {
                                audience: {
                                    type: "audience",
                                    label: "Public",
                                    mandatory: true,
                                    specificProps: {},
                                    condition({ date }) {
                                        return !!date;
                                    }
                                }
                            }
                        },
                        {
                            title: "Équipe",
                            icon: "users",
                            inputs: {
                                etp: {
                                    type: "etp",
                                    label: "Nombre d’ETP dédiés par fonction",
                                    mandatory: true,
                                    condition({ date }) {
                                        return !!date;
                                    }
                                }
                            }
                        },
                        {
                            title: "Droit commun et ressources",
                            description: "Nombre de personnes avec...",
                            icon: "id-card",
                            inputs: {
                                domiciliation: {
                                    type: "number",
                                    label: "une domiciliation",
                                    mandatory: false,
                                    condition({ date }) {
                                        return !!date;
                                    }
                                },
                                droits_caf: {
                                    type: "number",
                                    label: "des droits CAF ouverts",
                                    mandatory: false,
                                    condition({ date }) {
                                        return !!date;
                                    }
                                },
                                emploi_stable: {
                                    type: "number",
                                    label:
                                        "un emploi stable / ressources suffisantes",
                                    mandatory: false,
                                    condition({ date }) {
                                        return !!date;
                                    }
                                }
                            }
                        }
                    ],
                    submit: d => {
                        const builtData = { ...d, ...d.housing };
                        delete builtData.housing;
                        return addState(this.$route.params.id, builtData);
                    }
                }
            ]
        };

        data.varyingSections = {
            health: [
                {
                    title: "Santé",
                    description: "Nombre de personnes avec...",
                    icon: "user-md",
                    inputs: {
                        ame_valide: {
                            type: "number",
                            label: "une couverture AME valide",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        puma_valide: {
                            type: "number",
                            label: "une couverture PUMA valide",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        ame_en_cours: {
                            type: "number",
                            label: "une demande AME en cours",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        puma_en_cours: {
                            type: "number",
                            label: "une demande PUMA en cours",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        }
                    }
                },
                {
                    title: "",
                    description:
                        "Nombre de personnes ayant fait l'objet d'au moins",
                    icon: "user-md",
                    inputs: {
                        orientation: {
                            type: "number",
                            label:
                                "une orientation vers une structure de santé",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        accompagnement: {
                            type: "number",
                            label:
                                "un accompagnement physique vers une structure de santé",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        }
                    }
                }
            ],
            school: [
                {
                    title: "Éducation et scolarisation",
                    icon: "book-reader",
                    inputs: {
                        scolarisables: {
                            type: "number",
                            label:
                                "Parmi les mineurs, combien sont en âge d'être scolarisés ?",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        en_mediation: {
                            type: "number",
                            label:
                                "Combien bénéficient d’une action de médiation (3 – 18 ans) ?",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        maternelles: {
                            type: "number",
                            label: "Enfants scolarisés en maternelle",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        elementaires: {
                            type: "number",
                            label: "Enfants scolarisés en élémentaire",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        colleges: {
                            type: "number",
                            label: "Enfants scolarisés au collège",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        lycees: {
                            type: "number",
                            label:
                                "Enfants scolarisés au lycée - formation professionnelle",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        difficultes: {
                            type: "checkbox",
                            label: "Difficultés éventuelles rencontrées :",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            },
                            options: [
                                { value: "cantine", label: "Cantine" },
                                {
                                    value: "place_up2a",
                                    label: "Manque de place en UP2A"
                                },
                                { value: "transport", label: "Transport" }
                            ]
                        }
                    }
                }
            ],
            work: [
                {
                    title: "Formation et emploi",
                    icon: "briefcase",
                    description: "Nombre de personnes inscrites ou suivies par",
                    inputs: {
                        pole_emploi: {
                            type: "number",
                            label: "Pôle emploi",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        pole_emploi_femmes: {
                            type: "number",
                            label: "(dont femmes)",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        mission_locale: {
                            type: "number",
                            label: "Mission locale",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        mission_locale_femmes: {
                            type: "number",
                            label: "(dont femmes)",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        }
                    }
                },
                {
                    icon: "briefcase",
                    description: "Nombre de personnes ayant",
                    inputs: {
                        contrats: {
                            type: "number",
                            label: "un contrat",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        contrats_femmes: {
                            type: "number",
                            label: "(dont femmes)",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        formations: {
                            type: "number",
                            label: "une formation",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        formations_femmes: {
                            type: "number",
                            label: "(dont femmes)",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        autoentrepreneurs: {
                            type: "number",
                            label: "un statut autoentrepreneur",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        autoentrepreneurs_femmes: {
                            type: "number",
                            label: "(dont femmes)",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        are: {
                            type: "number",
                            label: "l'ARE",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        are_femmes: {
                            type: "number",
                            label: "(dont femmes)",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        }
                    }
                }
            ],
            housing: [
                {
                    title: "Logement",
                    icon: "home",
                    inputs: {
                        housing: {
                            type: "planHousing",
                            label: "",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        }
                    }
                }
            ],
            safety: [
                {
                    title: "Stabilisation et sécurisation du site",
                    icon: "seedling",
                    inputs: {
                        points_eau: {
                            type: "number",
                            label: "Nombre d'accès réguliers à l'eau potable",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        wc: {
                            type: "number",
                            label: "Nombre de sanitaires",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        electricite: {
                            type: "number",
                            label: "Nombre d'accès réguliers à l'électricité",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        },
                        nombre_bennes: {
                            type: "number",
                            label:
                                "Nombre de bennes disponibles pour le ramassage des déchets du site",
                            mandatory: false,
                            condition({ date }) {
                                return !!date;
                            }
                        }
                    }
                }
            ]
        };

        return data;
    },

    created() {
        this.load();
    },

    methods: {
        hasPermission,
        load() {
            if (["loading", "loaded"].indexOf(this.status) !== -1) {
                return;
            }

            this.status = "loading";
            this.error = null;

            get(this.$route.params.id)
                .then(plan => {
                    plan.topics.forEach(({ uid }) => {
                        if (!this.varyingSections[uid]) {
                            return;
                        }

                        this.varyingSections[uid].forEach(section => {
                            this.formDefinition.steps[0].sections.push(section);
                        });
                    });

                    const audienceSection = this.formDefinition.steps[0].sections.find(
                        ({ inputs }) => inputs.audience !== undefined
                    );
                    let lastState = null;

                    if (plan.states.length === 0) {
                        audienceSection.title =
                            "Qui sont les publics ayant intégré le dispositif ?";
                        audienceSection.description =
                            "Vous renseignez les indicateurs de suivi pour la première fois. Veuillez porter une attention particulière aux données que vous renseignez ci-dessous : les mises à jour ultérieures seront conditionnées par cette première déclaration.";
                        audienceSection.inputs.audience.specificProps.inOnly = true;
                    } else {
                        [lastState] = plan.states.slice(-1);
                        const dateOfLastState = App.formatDate(
                            lastState.date / 1000,
                            "d/m/y"
                        );

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

                    if (lastState) {
                        this.formData = {
                            difficultes: [
                                "cantine",
                                "place_up2a",
                                "transport"
                            ].filter(
                                d =>
                                    lastState.education &&
                                    (lastState.education[`difficulte_${d}`] ||
                                        lastState.education[`difficculte_${d}`])
                            ),
                            etp: lastState.etp.map(
                                ({ total, type: { uid } }) => ({
                                    total,
                                    type: uid
                                })
                            )
                        };
                    }

                    this.formDefinition.title = plan.name;
                    this.plan = plan;
                    this.status = "loaded";
                })
                .catch(error => {
                    this.error = error.user_message;
                    this.status = "loadingError";
                });
        },
        onComplete() {
            notify({
                group: "notifications",
                type: "success",
                title: "Indicateurs correctement enregistrés",
                text: "Le dispositif a bien été mis à jour"
            });

            this.$trackMatomoEvent(
                "Dispositif",
                "Mise à jour indicateurs",
                this.$route.params.id
            );

            this.$router.push(`/dispositif/${this.$route.params.id}`);
        }
    }
};
