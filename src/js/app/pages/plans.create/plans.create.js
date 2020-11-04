import NavBar from "#app/layouts/navbar/navbar.vue";
import Form from "#app/components/form/form.vue";
import { get as getConfig, hasPermission } from "#helpers/api/config";
import { create } from "#helpers/api/plan";
import {
    getByCategory,
    getMembers,
    getMembersOfCategory
} from "#helpers/api/organization";
import { notify } from "#helpers/notificationHelper";
import { getDepartementsForRegion } from "#helpers/api/geo";

export default {
    components: {
        NavBar,
        Form
    },

    data() {
        const { user: me, topics } = getConfig();
        const data = {
            user: me,
            formData: {
                association: []
            },
            loading: {
                status: null,
                error: null
            }
        };
        const that = this;
        const refs = this.$refs;

        const contactMissing = {
            type: "hidden",
            label: "Personne référente dans la structure",
            description:
                "Aucune personne de cette structure n'est encore enregistrée sur la plateforme résorption bidonville.",
            mandatory: true,
            condition({ association }) {
                return (
                    association !== undefined &&
                    association.length > 0 &&
                    refs.form.getInputById("contact").options.length === 0 &&
                    that.loadingAssociationContacts === false
                );
            }
        };

        data.formDefinition = {
            title: "Déclarer un dispositif",
            descriptionTitle: "Qu'est-ce qu'un dispositif ?",
            description:
                "C’est une action mise en place et financée en partie ou en totalité par un acteur public. Sa finalité est la résorption des bidonvilles.<br/><strong>Qui doit le déclarer ?</strong> Le service de l'Etat à l'initiative du dispositif doit le déclarer. L'acteur de terrain sera en charge de renseigner les informations relatives à l'action menée.",
            steps: [
                {
                    title: "Dispositf",
                    wording: {
                        error: "La déclaration du dispositif a échoué",
                        submit: "Déclarer le dispositif"
                    },
                    sections: [
                        {
                            title: "Intervention",
                            icon: "list",
                            inputs: {
                                name: {
                                    type: "text",
                                    label: "Nom du dispositif",
                                    mandatory: true
                                },
                                departement: {
                                    type: "select",
                                    label: "Département d'intervention",
                                    mandatory: true
                                },
                                startedAt: {
                                    type: "date",
                                    label: "Date de début",
                                    mandatory: true
                                },
                                expectedToEndAt: {
                                    type: "date",
                                    label: "Date de fin prévue (facultatif)",
                                    mandatory: false
                                },
                                in_and_out: {
                                    type: "radio",
                                    label:
                                        "Ce dispositif implique-t-il un système d'entrées et de sorties des personnes ?",
                                    mandatory: true,
                                    options: [
                                        { value: 1, label: "Oui" },
                                        { value: 0, label: "Non" }
                                    ]
                                },
                                topics: {
                                    type: "checkbox",
                                    label: "Champs d'intervention",
                                    description:
                                        "Les thématiques sélectionnées définissent l'action que vous menez et les indicateurs de suivi associés.",
                                    mandatory: true,
                                    options: topics.map(({ uid, name }) => ({
                                        value: uid,
                                        label: name
                                    }))
                                },
                                goals: {
                                    type: "textarea",
                                    label: "Objectifs",
                                    mandatory: true,
                                    specificProps: {
                                        placeholder:
                                            "Précisez les objectifs, les enjeux, le contexte du dispositif\n\nPar exemple : résorber le bidonville, scolariser 80% des enfants identités en bidonvilles..."
                                    }
                                }
                            }
                        },
                        {
                            title: "Lieu",
                            icon: "map-pin",
                            inputs: {
                                locationType: {
                                    type: "radio",
                                    label:
                                        "L'action se déroule dans le cadre suivant",
                                    mandatory: true,
                                    options: [
                                        {
                                            value: "shantytowns",
                                            label:
                                                "sur site(s) : bidonville ou squat"
                                        },
                                        {
                                            value: "location",
                                            label: "sur terrain d'insertion"
                                        },
                                        {
                                            value: "housing",
                                            label: "dans le logement"
                                        },
                                        {
                                            value: "other",
                                            label:
                                                "dans plusieurs lieux (hébergement, permanence, rue...)"
                                        }
                                    ]
                                },
                                locationShantytowns: {
                                    type: "townList",
                                    label: "Sites concernés",
                                    description: `Merci de sélectionner les sites concernés par le dispositif.<br/>Si vous ne trouvez pas un site, vous pouvez <a href="${
                                        this.$router.resolve("/nouveau-site")
                                            .href
                                    }" clas="link">déclarer un nouveau site</a>.`,
                                    mandatory: true,
                                    condition({ locationType }) {
                                        return locationType === "shantytowns";
                                    }
                                },
                                locationAddress: {
                                    type: "addressWithLocation",
                                    label: "Adresse du terrain d'insertion",
                                    mandatory: true,
                                    condition({ locationType }) {
                                        return locationType === "location";
                                    }
                                },
                                locationDetails: {
                                    type: "text",
                                    label: "Préciser",
                                    mandatory: true,
                                    condition({ locationType }) {
                                        return locationType === "other";
                                    }
                                }
                            }
                        },
                        {
                            title: "Contacts",
                            inputs: {
                                government: {
                                    type: "autocompleter",
                                    label:
                                        "Personne au service de l'état en charge du pilotage",
                                    mandatory: true,
                                    specificProps: {
                                        autocompleter: d => {
                                            const p = getMembersOfCategory(
                                                "public_establishment"
                                            );
                                            const p2 = p.then(({ users }) =>
                                                users
                                                    .filter(
                                                        ({
                                                            first_name: firstName,
                                                            last_name: lastName
                                                        }) =>
                                                            [
                                                                firstName,
                                                                lastName
                                                            ].some(value =>
                                                                d
                                                                    .split(" ")
                                                                    .every(
                                                                        part =>
                                                                            value
                                                                                .toLowerCase()
                                                                                .indexOf(
                                                                                    part.toLowerCase()
                                                                                ) !==
                                                                            -1
                                                                    )
                                                            )
                                                    )
                                                    .map(
                                                        ({
                                                            id,
                                                            first_name: firstName,
                                                            last_name: lastName
                                                        }) => ({
                                                            id,
                                                            label: `${firstName} ${lastName.toUpperCase()}`
                                                        })
                                                    )
                                            );
                                            p2.abort = p.abort;

                                            return p2;
                                        },
                                        showCategory: false,
                                        allowMultiple: false,
                                        float: true
                                    }
                                },
                                association: {
                                    type: "autocompleter",
                                    label:
                                        "Opérateur ou service en charge de l'intervention",
                                    mandatory: true,
                                    specificProps: {
                                        autocompleter: d => {
                                            const p = getByCategory(
                                                "association"
                                            );
                                            const p2 = p.then(
                                                ({ organizations }) =>
                                                    organizations
                                                        .filter(
                                                            ({
                                                                name,
                                                                abbreviation
                                                            }) =>
                                                                d
                                                                    .split(" ")
                                                                    .every(
                                                                        part =>
                                                                            name
                                                                                .toLowerCase()
                                                                                .indexOf(
                                                                                    part.toLowerCase()
                                                                                ) !==
                                                                            -1
                                                                    ) ||
                                                                (abbreviation !==
                                                                    null &&
                                                                    abbreviation
                                                                        .toLowerCase()
                                                                        .indexOf(
                                                                            d.toLowerCase()
                                                                        ) >= 0)
                                                        )
                                                        .map(organization => ({
                                                            id: organization.id,
                                                            label:
                                                                organization.name,
                                                            category: `${organization.departement_code} - ${organization.departement_name}`,
                                                            data: {
                                                                name:
                                                                    organization.name,
                                                                departement:
                                                                    organization.departement_code
                                                            }
                                                        }))
                                            );
                                            p2.abort = p.abort;

                                            return p2;
                                        },
                                        showCategory: true,
                                        allowMultiple: false,
                                        float: true
                                    }
                                },
                                contact: {
                                    type: "select",
                                    label:
                                        "Personne référente dans la structure",
                                    mandatory: true,
                                    options: [],
                                    condition({ association }) {
                                        return (
                                            association !== undefined &&
                                            association.length > 0 &&
                                            this.options.length > 0
                                        );
                                    }
                                },
                                contact_missing: contactMissing
                            }
                        },
                        {
                            title: "Financements",
                            inputs: {
                                finances: {
                                    type: "planFunding",
                                    label: "Financements",
                                    mandatory: false
                                }
                            }
                        }
                    ],
                    submit: create
                }
            ]
        };

        if (hasPermission("user.create")) {
            window.createUser = this.createUser;
            contactMissing.description +=
                '<br/><a class="link" onclick="createUser()">Vous pouvez créer un compte utilisateur en cliquant ici.</span>';
        }

        if (me.organization.category.uid === "public_establishment") {
            data.formData.government = [
                {
                    id: me.id,
                    label: `${me.first_name} ${me.last_name.toUpperCase()}`
                }
            ];
        }

        return data;
    },

    watch: {
        "formData.association": function organizationType() {
            this.loadingAssociationContacts = true;
            this.$refs.form.getInputById("contact").options = [];

            if (this.formData.association.length === 0) {
                return;
            }

            getMembers(this.formData.association[0].id).then(({ users }) => {
                this.$refs.form.getInputById("contact").options = users.map(
                    ({ id, first_name: firstName, last_name: lastName }) => ({
                        value: id,
                        label: `${firstName} ${lastName.toUpperCase()}`
                    })
                );
                this.loadingAssociationContacts = false;
            });
        }
    },

    mounted() {
        this.load();
        window.addEventListener(
            "message",
            ({ data }) => {
                this.$refs.form.getInputById("contact").options = [
                    {
                        value: data.id,
                        label: `${
                            data.first_name
                        } ${data.last_name.toUpperCase()}`
                    }
                ];
                this.formData.contact = data.id;
                this.loadingAssociationContacts = false;

                notify({
                    group: "notifications",
                    type: "success",
                    title: "Utilisateur créé",
                    text: "La personne référente est désormais sélectionnée"
                });
            },
            false
        );
    },

    methods: {
        getDepartementsForCurrentUser() {
            const LEVEL_VALUES = {
                city: 1,
                epci: 2,
                departement: 3,
                region: 4,
                nation: 5
            };
            const featureLevel = this.user.permissions.plan.create
                .geographic_level;
            const userLevel = this.user.organization.location.type;

            let level;
            if (featureLevel === "local") {
                level = userLevel;
            } else if (LEVEL_VALUES[userLevel] > LEVEL_VALUES[featureLevel]) {
                level = userLevel;
            } else {
                level = featureLevel;
            }

            // feature level = "local"
            switch (level) {
                case "nation": {
                    const { departements } = getConfig();
                    return Promise.resolve(departements);
                }

                case "region":
                    return getDepartementsForRegion(
                        this.user.organization.location.region.code
                    ).then(({ departements }) => departements);

                default:
                    return Promise.resolve([
                        this.user.organization.location.departement
                    ]);
            }
        },

        load() {
            if (
                this.loading.status === "loading" ||
                this.loading.status === "completed"
            ) {
                return;
            }

            this.loading.status = "loading";
            this.loading.error = null;

            this.getDepartementsForCurrentUser()
                .then(departements => {
                    this.loading.status = "completed";

                    this.$nextTick(() => {
                        const input = this.$refs.form.getInputById(
                            "departement"
                        );
                        input.options = departements.map(({ code, name }) => ({
                            label: `${code} - ${name}`,
                            value: code
                        }));
                    });
                })
                .catch(error => {
                    this.loading.status = "failed";
                    this.loading.error = error;
                });
        },
        createUser() {
            const { name, departement } = this.formData.association[0].data;
            const { href } = this.$router.resolve("/nouvel-utilisateur");
            window.open(
                `${href}?association_name=${encodeURIComponent(
                    name
                )}&association_departement=${departement}`,
                "newUser",
                "menubar=no, status=no"
            );
        },
        onComplete(stepData, [{ id }]) {
            notify({
                group: "notifications",
                type: "success",
                title: "Dispositif correctement déclaré",
                text: "Le dispositif a bien été ajouté en base de données"
            });

            this.$router.push(`/dispositif/${id}`);
        }
    }
};
