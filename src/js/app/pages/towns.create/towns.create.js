import NavBar from "#app/layouts/navbar/navbar.vue";
import { get as getConfig, hasPermission } from "#helpers/api/config";
import Form from "#app/components/form/form.vue";
import { add } from "#helpers/api/town";

export default {
    components: {
        NavBar,
        Form
    },
    data() {
        const {
            field_types: fieldTypes,
            owner_types: ownerTypes,
            social_origins: socialOrigins,
            electricity_types: electricityTypes
        } = getConfig();

        const censusStatuses = [
            { value: "none", label: "Non prévu" },
            { value: "scheduled", label: "Prévu" },
            { value: "done", label: "Réalisé" },
            { value: null, label: "Inconnu" }
        ];

        const yesNoValues = [
            { value: 1, label: "Oui" },
            { value: 0, label: "Non" },
            { value: -1, label: "Inconnu" }
        ];

        const cfpValues = [
            { value: "none", label: "Non demandé" },
            { value: "requested", label: "Demandé" },
            { value: "granted", label: "Obtenu" },
            { value: null, label: "Inconnu" }
        ];

        const formDefinition = {
            title: "Déclaration d'un site",
            description:
                "Ce formulaire vous permet de déclarer un site identifié sur votre territoire (bidonville ou squat). Il est divisé en quatre onglets : caractéristiques, démographie, conditions de vie et procédure judiciaire d'expulsion des occupants. Lorsque le symbole (*) apparaît en rouge au début de l'intitulé de la question, cela signifie qu'il s'agit d'une question obligatoire. Il n'est pas possible de valider le formulaire sans y avoir répondu.",
            steps: [
                {
                    title: "Caractéristiques du site",
                    sections: [
                        ...[
                            {
                                title: "Caractéristiques",
                                inputs: {
                                    address: {
                                        type: "addressWithLocation",
                                        label: "Localisation géographique",
                                        description:
                                            "Saisissez ici l'adresse du site, puis précisez sa position en déplaçant le point sur la carte.",
                                        mandatory: true
                                    },
                                    name: {
                                        type: "text",
                                        label: "Appellation du site",
                                        description:
                                            "Exemples : Entrepôt de la Poste, Rond-point du centre...",
                                        mandatory: false,
                                        specificProps: {
                                            maxlength: 35
                                        }
                                    },
                                    detailed_address: {
                                        type: "text",
                                        label: "Informations d'accès",
                                        description:
                                            "Saisissez ici toutes les informations qui, en plus de l'adresse, peuvent être utiles pour l'accès au site.",
                                        mandatory: false
                                    },
                                    priority: {
                                        type: "radio",
                                        options: [
                                            { label: "1", value: 1 },
                                            { label: "2", value: 2 },
                                            { label: "3", value: 3 }
                                        ],
                                        label: "Niveau de priorité du site",
                                        description:
                                            "1 étant le niveau de priorité le plus haut.<br/>Le niveau de priorité est un indicateur réservé aux correspondants des services de l’État.",
                                        mandatory: false
                                    },
                                    built_at: {
                                        type: "date",
                                        label: "Date d'installation du site",
                                        mandatory: true
                                    },
                                    declared_at: {
                                        type: "date",
                                        label: "Date de signalement du site",
                                        mandatory: false
                                    },
                                    field_type: {
                                        type: "radio",
                                        options: fieldTypes.map(
                                            ({ id, label }) => ({
                                                label,
                                                value: id
                                            })
                                        ),
                                        label: "Type de site",
                                        mandatory: true
                                    },
                                    owner_type: {
                                        type: "radio",
                                        options: ownerTypes.map(
                                            ({ id, label }) => ({
                                                label,
                                                value: id
                                            })
                                        ),
                                        label: "Type de propriétaire",
                                        mandatory: true
                                    },
                                    owner: {
                                        type: "text",
                                        label: "Identité du propriétaire",
                                        condition({ owner_type: ownerType }) {
                                            return (
                                                ownerType &&
                                                ownerTypes.find(
                                                    ({ id }) => id === ownerType
                                                ).label !== "Inconnu"
                                            );
                                        }
                                    }
                                }
                            },
                            {
                                title: "Habitants",
                                inputs: {
                                    census_status: {
                                        type: "radio",
                                        options: censusStatuses,
                                        label: "Statut du diagnostic social",
                                        description:
                                            "Un diagnostic social vise à identifier les situations et besoins des familles et personnes, de repérer le contexte territorial et les acteurs en présence.",
                                        mandatory: true
                                    },
                                    census_conducted_at: {
                                        type: "date",
                                        label: "Date du diagnostic",
                                        mandatory: true,
                                        condition({
                                            census_status: censusStatus
                                        }) {
                                            return (
                                                ["scheduled", "done"].indexOf(
                                                    censusStatus
                                                ) !== -1
                                            );
                                        }
                                    },
                                    census_conducted_by: {
                                        type: "text",
                                        label:
                                            "Service ou opérateur en charge du diagnostic",
                                        mandatory: true,
                                        condition({
                                            census_status: censusStatus
                                        }) {
                                            return (
                                                ["scheduled", "done"].indexOf(
                                                    censusStatus
                                                ) !== -1
                                            );
                                        }
                                    },
                                    population_total: {
                                        type: "number",
                                        label: "Nombre de personnes",
                                        description:
                                            "Laissez ce champ vide si l'information est inconnue",
                                        mandatory: false
                                    },
                                    population_couples: {
                                        type: "number",
                                        label: "Nombre de ménages",
                                        description:
                                            "Laissez ce champ vide si l'information est inconnue",
                                        mandatory: false
                                    },
                                    population_minors: {
                                        type: "number",
                                        label: "Nombre de mineurs",
                                        description:
                                            "Laissez ce champ vide si l'information est inconnue",
                                        mandatory: false
                                    },
                                    social_origins: {
                                        type: "checkbox",
                                        options: socialOrigins.map(
                                            ({ id, label }) => ({
                                                label,
                                                value: id
                                            })
                                        ),
                                        label: "Origines",
                                        description:
                                            "Ne rien cocher si l'information est inconnue",
                                        mandatory: false
                                    }
                                }
                            },
                            {
                                title: "Conditions de vie",
                                inputs: {
                                    electricity_type: {
                                        type: "radio",
                                        options: electricityTypes.map(
                                            ({ id, label }) => ({
                                                label,
                                                value: id
                                            })
                                        ),
                                        label: "Accès à l'électricité",
                                        mandatory: true
                                    },
                                    electricity_comments: {
                                        type: "textarea",
                                        label: "Modalités d'accès",
                                        description:
                                            "Exemples : groupe électrogène, raccordement à une usine...",
                                        mandatory: false
                                    },
                                    access_to_water: {
                                        type: "radio",
                                        options: yesNoValues,
                                        label: "Accès à l'eau",
                                        mandatory: true
                                    },
                                    water_comments: {
                                        type: "textarea",
                                        label: "Modalités d'accès",
                                        description:
                                            "Exemples: Citerne de 100 litres remplie par les pompiers tous les jours, 3 robinets raccordés par la collectivité, borne incendie à 200 mètres...",
                                        mandatory: false
                                    },
                                    access_to_sanitary: {
                                        type: "radio",
                                        options: yesNoValues,
                                        label: "Accès à des toilettes",
                                        mandatory: true
                                    },
                                    sanitary_comments: {
                                        type: "textarea",
                                        label: "Modalités d'accès",
                                        description:
                                            "Exemples : 3 toilettes sèches, toilettes raccordés au réseau, un bloc sanitaire fourni par la ville...",
                                        mandatory: false
                                    },
                                    trash_evacuation: {
                                        type: "radio",
                                        options: yesNoValues,
                                        label: "Évacuation des déchets",
                                        mandatory: true
                                    }
                                }
                            }
                        ],
                        ...(hasPermission("shantytown.create.data_justice")
                            ? [
                                  {
                                      title:
                                          "Procédure judiciaire d'expulsion des occupants",
                                      inputs: {
                                          owner_complaint: {
                                              type: "radio",
                                              options: yesNoValues,
                                              label:
                                                  "Dépôt de plainte par le propriétaire",
                                              mandatory: true
                                          },
                                          justice_procedure: {
                                              type: "radio",
                                              options: yesNoValues,
                                              label:
                                                  "Existence d'une procédure judiciaire",
                                              mandatory: true
                                          },
                                          justice_rendered: {
                                              type: "radio",
                                              options: yesNoValues,
                                              label:
                                                  "Décision de justice rendue",
                                              mandatory: true,
                                              condition({
                                                  justice_procedure: justiceProcedure
                                              }) {
                                                  return justiceProcedure === 1;
                                              }
                                          },
                                          justice_rendered_by: {
                                              type: "text",
                                              label: "Origine de la décision",
                                              mandatory: true,
                                              condition({
                                                  justice_procedure: justiceProcedure,
                                                  justice_rendered: justiceRendered
                                              }) {
                                                  return (
                                                      justiceProcedure === 1 &&
                                                      justiceRendered === 1
                                                  );
                                              }
                                          },
                                          justice_rendered_at: {
                                              type: "date",
                                              label: "Date de la décision",
                                              mandatory: true,
                                              condition({
                                                  justice_procedure: justiceProcedure,
                                                  justice_rendered: justiceRendered
                                              }) {
                                                  return (
                                                      justiceProcedure === 1 &&
                                                      justiceRendered === 1
                                                  );
                                              }
                                          },
                                          justice_challenged: {
                                              type: "radio",
                                              options: yesNoValues,
                                              label:
                                                  "Contentieux relatif à la décision de justice",
                                              mandatory: true,
                                              condition({
                                                  justice_procedure: justiceProcedure,
                                                  justice_rendered: justiceRendered
                                              }) {
                                                  return (
                                                      justiceProcedure === 1 &&
                                                      justiceRendered === 1
                                                  );
                                              }
                                          },
                                          police_status: {
                                              type: "radio",
                                              options: cfpValues,
                                              label:
                                                  "Concours de la force publique",
                                              mandatory: true
                                          },
                                          police_requested_at: {
                                              type: "date",
                                              label:
                                                  "Date de la demande du CFP",
                                              mandatory: true,
                                              condition({
                                                  police_status: policeStatus
                                              }) {
                                                  return (
                                                      [
                                                          "requested",
                                                          "granted"
                                                      ].indexOf(
                                                          policeStatus
                                                      ) !== -1
                                                  );
                                              }
                                          },
                                          police_granted_at: {
                                              type: "date",
                                              label: "Date d'octroi du CFP",
                                              mandatory: true,
                                              condition({
                                                  police_status: policeStatus
                                              }) {
                                                  return (
                                                      policeStatus === "granted"
                                                  );
                                              }
                                          },
                                          bailiff: {
                                              type: "text",
                                              label:
                                                  "Nom de l'étude d'huissiers",
                                              mandatory: false
                                          }
                                      }
                                  }
                              ]
                            : [])
                    ],
                    wording: {
                        submit: "Déclarer le site",
                        error: "La déclaration du site a échoué",
                        success: "La déclaration du site a réussi"
                    },
                    submit: data => {
                        const dateFields = [
                            "built_at",
                            "declared_at",
                            "census_conducted_at",
                            "justice_rendered_at",
                            "police_requested_at",
                            "police_granted_at"
                        ];
                        dateFields.forEach(field => {
                            const d = data[field];
                            if (d) {
                                Object.assign(data, {
                                    [field]: `${d.getFullYear()}-${`${d.getMonth() +
                                        1}`.padStart(
                                        2,
                                        "0"
                                    )}-${`${d.getDate()}`.padStart(2, "0")}`
                                });
                            }
                        });

                        const p = add(data);
                        p.then(({ plans }) => {
                            formDefinition.steps[1].sections[0].inputs.plans.options = plans.map(
                                ({ id, name, type }) => ({
                                    label: name || type,
                                    value: id
                                })
                            );
                        });
                        return p;
                    }
                }

                // {
                //     title: 'Dispositifs en cours sur le site',
                //     sections: [
                //         {
                //             title: 'Sélection des dispositifs',
                //             description: 'Des dispositifs sont déjà en place sur le territoire d\'implantation du site que vous venez de déclarer.',
                //             inputs: {
                //                 plans: {
                //                     type: 'checkbox',
                //                     label: 'Dispositifs',
                //                     description: 'Veuillez cocher, parmi ceux listés ci-dessous, les dispositifs déployés sur le site que vous venez de déclarer',
                //                     mandatory: true,
                //                     options: [],
                //                 },
                //             },
                //         },
                //     ],
                //     wording: {
                //         submit: 'Valider les dispositfs',
                //         error: 'L\'intégration du site aux dispositifs a échoué',
                //         success: 'L\'intégration du site aux dispositifs a réussi',
                //     },
                //     submit: (data, [{ town: { id: townId } }]) => Promise.all(data.plans.map((planId) => link(planId, townId))),
                // },
            ]
        };

        return {
            data: {},
            formDefinition
        };
    },

    methods: {
        onStepComplete(index, stepData) {
            if (index === 0) {
                if (!stepData.plans || stepData.plans.length === 0) {
                    this.$nextTick(() => {
                        this.$refs.form.goToNextStep(null);
                    });
                }
            }
        },
        onComplete(
            stepData,
            [
                {
                    town: { id }
                }
            ]
        ) {
            this.$router.push(`/site/${id}`);
        }
    }
};
