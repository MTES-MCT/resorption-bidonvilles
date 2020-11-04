import NavBar from "#app/layouts/navbar/navbar.vue";
import SlideNote from "#app/components/slide-note/slide-note.vue";
import Map from "#app/components/map/map.vue";
import { get, close } from "#helpers/api/plan";
import { hasPermission, get as getConfig } from "#helpers/api/config";
import PlanFunding from "#app/components/form/input/planFunding/planFunding.vue";
import Input from "#app/components/form/input/input.vue";
import { notify } from "#helpers/notificationHelper";

export default {
    components: {
        NavBar,
        SlideNote,
        Map,
        PlanFunding,
        Input
    },

    data() {
        const { etp_types: etpTypes } = getConfig();

        return {
            status: null,
            error: null,
            plan: null,
            etpTypes,
            currentFinanceIndex: 0,
            closingAlertStatus: "hidden",
            closingErrors: [],
            closingStatus: null,
            closingData: {
                closedAt: new Date(),
                finances: [],
                comment: ""
            },

            housingFields: [
                { name: "siao", label: "Demandes SIAO" },
                {
                    name: "logement_social",
                    label: "Demandes de logement social"
                },
                { name: "dalo", label: "Demandes DALO" },
                {
                    name: "accompagnes",
                    label: "Accès à un logement accompagné / adapté"
                },
                {
                    name: "non_accompagnes",
                    label: "Accès à un logement sans accompagnement"
                },
                { name: "heberges", label: "Hébergements" }
            ]
        };
    },

    created() {
        this.load();
    },

    computed: {
        closingCommentDescription() {
            if (!this.audience) {
                return "";
            }

            const remainingAudience = { ...this.audience.in };
            ["out_positive", "out_abandoned", "out_excluded"].forEach(key => {
                remainingAudience.total -= this.audience[key].total;
                remainingAudience.families -= this.audience[key].families;
                remainingAudience.women -= this.audience[key].women;
                remainingAudience.minors -= this.audience[key].minors;
            });

            if (
                remainingAudience.total === 0 &&
                remainingAudience.families === 0 &&
                remainingAudience.women === 0 &&
                remainingAudience.minors === 0
            ) {
                return "Précisez les raisons de la fermeture du dispositif";
            }

            return `À la fermeture du dispositif, ${
                remainingAudience.families
            } ménage${remainingAudience.families > 1 ? "s" : ""} (soit ${
                remainingAudience.total
            } personne${
                remainingAudience.total > 1 ? "s" : ""
            }) sont identifiés dans le dispositif. Merci de préciser les solutions mobilisées pour ces personnes et les raisons de la fermeture du dispositif.<br /><br />Merci de respecter les règles de confidentialité.Ne pas citer l'identité des individus (Nom, âge, sexe, origine...)`;
        },
        reachedMaxFinanceIndex() {
            if (
                !this.plan ||
                !this.plan.finances ||
                this.plan.finances.length === 0
            ) {
                return true;
            }

            return this.currentFinanceIndex === 0;
        },
        reachedMinFinanceIndex() {
            if (
                !this.plan ||
                !this.plan.finances ||
                this.plan.finances.length === 0
            ) {
                return true;
            }

            return this.currentFinanceIndex >= this.plan.finances.length - 1;
        },
        minYear() {
            if (
                !this.plan ||
                !this.plan.finances ||
                this.plan.finances.length === 0
            ) {
                return null;
            }

            return this.plan.finances.reduce(
                (min, { year }) => (min !== null ? Math.min(min, year) : year),
                null
            );
        },
        availableEtpTypes() {
            return this.etpTypes.filter(({ uid }) =>
                this.plan.states.some(({ etp }) =>
                    etp.some(({ type: { uid: u } }) => uid === u)
                )
            );
        },
        address() {
            if (!this.plan.location) {
                return null;
            }

            return {
                latitude: this.plan.location.latitude,
                longitude: this.plan.location.longitude,
                address: this.plan.location.label
            };
        },
        center() {
            if (!this.plan.location) {
                return null;
            }

            return {
                center: [
                    this.plan.location.latitude,
                    this.plan.location.longitude
                ],
                zoom: 15
            };
        },
        lastState() {
            if (!this.plan || this.plan.states.length === 0) {
                return null;
            }

            return this.plan.states.slice(-1)[0];
        },
        audience() {
            if (!this.plan || this.plan.states.length === 0) {
                return null;
            }

            function sum(originalObj, additionalObj) {
                return {
                    total: originalObj.total + additionalObj.total,
                    families: originalObj.families + additionalObj.families,
                    women: originalObj.women + additionalObj.women,
                    minors: originalObj.minors + additionalObj.minors
                };
            }

            return this.plan.states.reduce(
                (acc, { audience }) => {
                    if (audience.in) {
                        acc.in = sum(acc.in, audience.in);
                    }

                    if (audience.out_positive) {
                        acc.out_positive = sum(
                            acc.out_positive,
                            audience.out_positive
                        );
                    }

                    if (audience.out_abandoned) {
                        acc.out_abandoned = sum(
                            acc.out_abandoned,
                            audience.out_abandoned
                        );
                    }

                    if (audience.out_excluded) {
                        acc.out_excluded = sum(
                            acc.out_excluded,
                            audience.out_excluded
                        );
                    }

                    return acc;
                },
                {
                    in: {
                        total: 0,
                        families: 0,
                        women: 0,
                        minors: 0
                    },
                    out_positive: {
                        total: 0,
                        families: 0,
                        women: 0,
                        minors: 0
                    },
                    out_abandoned: {
                        total: 0,
                        families: 0,
                        women: 0,
                        minors: 0
                    },
                    out_excluded: {
                        total: 0,
                        families: 0,
                        women: 0,
                        minors: 0
                    }
                }
            );
        }
    },

    methods: {
        hasPermission,
        financeTotal() {
            if (!this.plan || !this.plan.finances) {
                return 0;
            }

            return this.plan.finances[this.currentFinanceIndex].data.reduce(
                (total, { amount }) => total + parseFloat(amount),
                0
            );
        },
        load() {
            if (["loading", "loaded"].indexOf(this.status) !== -1) {
                return;
            }

            this.status = "loading";
            this.error = null;

            get(this.$route.params.id)
                .then(data => {
                    this.plan = data;
                    this.closingData.finances = this.plan.finances.map(
                        finance => ({
                            ...finance,
                            data: finance.data.map(row => ({
                                ...row,
                                type: row.type.uid
                            }))
                        })
                    );
                    this.status = "loaded";
                })
                .catch(({ user_message: message }) => {
                    this.error = message;
                    this.status = "loadingError";
                });
        },
        escapeHtml(...args) {
            return App.escapeHtml(...args);
        },
        dateDiff(...args) {
            return App.dateDiff(...args);
        },
        formatDate(...args) {
            return App.formatDate(...args);
        },

        showPreviousYear() {
            if (this.reachedMinFinanceIndex) {
                return;
            }

            this.currentFinanceIndex += 1;
        },

        showNextYear() {
            if (this.reachedMaxFinanceIndex) {
                return;
            }

            this.currentFinanceIndex -= 1;
        },

        setClosingAlertStatus(newStatus) {
            this.closingErrors = [];
            this.closingAlertStatus = newStatus;
        },

        checkClosing() {
            const yearsInError = [];
            for (
                let year = new Date().getFullYear();
                year >= Math.max(2019, this.minYear);
                year -= 1
            ) {
                const finance = this.closingData.finances.find(
                    ({ year: y }) => y === year
                );
                if (
                    !finance ||
                    finance.data.length === 0 ||
                    finance.data.some(
                        ({ realAmount }) =>
                            realAmount === undefined || realAmount === null
                    )
                ) {
                    yearsInError.push(year);
                }
            }

            if (yearsInError.length > 0) {
                this.closingErrors = yearsInError.map(
                    year =>
                        `Les dépenses exécutées pour l'année ${year} ne sont pas renseignées, il n'est pas possible de fermer le dispositif.`
                );
            } else {
                this.setClosingAlertStatus("step2");
            }
        },

        close() {
            if (this.closingStatus === "pending") {
                return;
            }

            this.closingStatus = "pending";

            close(this.$route.params.id, this.closingData)
                .then(() => {
                    this.closingStatus = "success";
                    notify({
                        group: "notifications",
                        type: "success",
                        title: "Dispositif fermé",
                        text: "Le dispositif a bien été fermé"
                    });
                    this.$router.push("/liste-des-dispositifs");
                })
                .catch(({ fields }) => {
                    this.closingStatus = "error";
                    this.closingErrors = Object.keys(fields).reduce(
                        (acc, key) => [...acc, ...fields[key]],
                        []
                    );
                });
        }
    }
};
