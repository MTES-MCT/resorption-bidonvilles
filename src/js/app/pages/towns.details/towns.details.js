import simplebar from "simplebar-vue";
import Datepicker from "vuejs-datepicker";
import { fr } from "vuejs-datepicker/dist/locale";
import NavBar from "#app/layouts/navbar/navbar.vue";
import Map from "#app/components/map/map.vue";
import AddressWithLocation from "#app/components/form/input/address-with-location/address-with-location.vue";
import CommentDeletion from "#app/components/comment-deletion/comment-deletion.vue";
import {
    get,
    close,
    edit,
    destroy,
    addComment,
    editComment,
    addCovidComment
} from "#helpers/api/town";
import { get as getConfig, hasPermission } from "#helpers/api/config";
import { notify } from "#helpers/notificationHelper";

function boolToYesNoValue(bool) {
    if (bool === true) {
        return 1;
    }

    if (bool === false) {
        return 0;
    }

    return -1;
}

export default {
    components: {
        NavBar,
        Map,
        AddressWithLocation,
        Datepicker,
        simplebar,
        CommentDeletion
    },
    data() {
        return {
            userId: getConfig().user.id,
            loading: false,
            error: null,
            town: null,
            view: "details",
            mode: "view",
            editError: null,
            deleteError: null,
            fieldErrors: {},
            electricityTypes: getConfig().electricity_types,
            fieldTypes: getConfig().field_types,
            ownerTypes: getConfig().owner_types,
            socialOrigins: getConfig().social_origins,
            closingSolutions: getConfig().closing_solutions,
            dateLanguage: fr,
            yesnoValues: [
                { value: 1, label: "Oui" },
                { value: 0, label: "Non" },
                { value: -1, label: "Inconnu" }
            ],
            closedWithSolutionsValues: [
                { value: true, label: "Oui" },
                { value: false, label: "Non" }
            ],
            statusValues: [
                {
                    value: "closed_by_justice",
                    label: "Exécution d'une décision de justice"
                },
                {
                    value: "closed_by_admin",
                    label: "Exécution d'une décision administrative"
                },
                { value: "other", label: "Autre" },
                { value: "unknown", label: "Raison inconnue" }
            ],
            diagnosisValues: [
                { value: "none", label: "Non prévu" },
                { value: "scheduled", label: "Prévu" },
                { value: "done", label: "Réalisé" },
                { value: null, label: "Inconnu" }
            ],
            cfpValues: [
                { value: "none", label: "Non demandé" },
                { value: "requested", label: "Demandé" },
                { value: "granted", label: "Obtenu" },
                { value: null, label: "Inconnu" }
            ],
            newComment: "",
            covidComment: {
                date: new Date(),
                description: "",
                equipe_maraude: false,
                equipe_sanitaire: false,
                equipe_accompagnement: false,
                distribution_alimentaire: false,
                personnes_orientees: false,
                personnes_avec_symptomes: false,
                besoin_action: false
            },
            covidTags: [
                {
                    prop: "equipe_maraude",
                    label: "Équipe de maraude",
                    type: "warning"
                },
                {
                    prop: "equipe_sanitaire",
                    label: "Équipe sanitaire",
                    type: "warning"
                },
                {
                    prop: "equipe_accompagnement",
                    label: "Équipe d'accompagnement",
                    type: "warning"
                },
                {
                    prop: "distribution_alimentaire",
                    label: "Distribution d'aide alimentaire",
                    type: "warning"
                },
                {
                    prop: "personnes_orientees",
                    label:
                        "Personne(s) orientée(s) vers un centre d'hébergement spécialisé (desserrement)",
                    type: "error"
                },
                {
                    prop: "personnes_avec_symptomes",
                    label: "Personne(s) avec des symptômes Covid-19",
                    type: "error"
                },
                {
                    prop: "besoin_action",
                    label: "Besoin d'une action prioritaire",
                    type: "error"
                }
            ],
            sidePanel: null,
            commentError: null,
            commentErrors: {},
            covidErrors: [],
            edit: null,
            commentEdit: {
                commentId: null,
                value: null,
                pending: false,
                error: null
            },
            asideTimeout: null,
            commentToBeDeleted: null
        };
    },
    computed: {
        status() {
            if (this.town === null) {
                return null;
            }

            switch (this.town.status) {
                case "open":
                    return "existe";

                case "closed_by_justice":
                case "closed_by_admin":
                case "other":
                case "unknown":
                    return this.town.closedWithSolutions === "yes"
                        ? "résorbé"
                        : "disparu";

                default:
                    return "inconnu";
            }
        },
        statusLabel() {
            if (this.town === null) {
                return "inconnu";
            }

            switch (this.town.status) {
                case "closed_by_justice":
                    return "Exécution d'une décision de justice";

                case "closed_by_admin":
                    return "Exécution d'une décision administrative";

                case "other":
                    return "Autre";

                default:
                    return "inconnu";
            }
        },
        center() {
            return {
                center: [this.town.latitude, this.town.longitude],
                zoom: 15
            };
        },
        hasAccessToWater() {
            if (!this.edit) {
                return false;
            }

            return this.edit.accessToWater === 1;
        },
        hasAccessToElectricity() {
            if (!this.edit) {
                return false;
            }

            const type = this.electricityTypes.find(
                ({ id }) => id === this.edit.electricityType
            );
            return type && type.label.indexOf("Oui") !== -1; // @todo: aaaaawfuuuuulllyyyyy baaaaaaad...
        }
    },
    mounted() {
        this.scroll = window.pageYOffset;
        window.addEventListener("scroll", this.stickTheHeader);
    },
    destroyed() {
        window.removeEventListener("scroll", this.stickTheHeader);
        document.body.removeEventListener("click", this.checkClickOutsideAside);
    },
    created() {
        this.fetchData();
    },
    methods: {
        showAside(content) {
            this.sidePanel = content;
            this.asideTimeout = setTimeout(() => {
                document.body.addEventListener(
                    "click",
                    this.checkClickOutsideAside
                );
            }, 100);
        },
        hideAside() {
            clearTimeout(this.asideTimeout);
            this.sidePanel = null;
            document.body.removeEventListener(
                "click",
                this.checkClickOutsideAside
            );
        },
        checkClickOutsideAside(event) {
            if (
                (!this.$refs.commentDeletionPopin ||
                    !this.$refs.commentDeletionPopin.$el.contains(
                        event.target
                    )) &&
                !this.$refs.aside.contains(event.target) &&
                event.target.dataset.group !== "sidePanelLink"
            ) {
                this.hideAside();
            }
        },
        hasPermission: permissionName => hasPermission(permissionName),
        offsetTop(el) {
            let next = el;
            let offset = 0;
            while (next !== null) {
                offset += next.offsetTop;
                next = next.offsetParent;
            }

            return offset;
        },
        stickTheHeader() {
            const goesUp = window.pageYOffset < this.scroll;
            this.scroll = window.pageYOffset;

            if (
                this.$refs.main === undefined ||
                this.$refs.header === undefined
            ) {
                return;
            }

            if (goesUp === true) {
                if (window.pageYOffset - this.$refs.main.offsetTop <= 0) {
                    this.$refs.wrapper.classList.remove("sticky");
                }
            } else if (window.pageYOffset > this.offsetTop(this.$refs.header)) {
                this.$refs.wrapper.classList.add("sticky");
            }
        },
        formatDate: (...args) => App.formatDate(...args),
        fetchData() {
            if (this.loading === true) {
                return;
            }

            this.loading = true;
            this.error = null;

            get(this.$route.params.id)
                .then(town => {
                    this.loading = false;
                    this.town = town;
                    this.resetEdit();
                })
                .catch(errors => {
                    this.error = errors.user_message;
                    this.loading = false;
                });
        },
        setViewMode() {
            this.mode = "view";
        },
        setEditMode() {
            if (!hasPermission("shantytown.update")) {
                return;
            }

            this.setView("details");
            this.resetEdit();
            this.mode = "edit";
        },
        setCloseMode() {
            if (!hasPermission("shantytown.close")) {
                return;
            }

            this.resetEdit();
            this.mode = "close";
        },
        closePopin() {
            this.resetEdit();
            this.mode = "view";
        },
        resetEdit() {
            this.editError = null;
            this.fieldErrors = {};

            if (this.town === null) {
                this.edit = null;
                return;
            }

            this.edit = {
                priority: this.town.priority,
                name: this.town.name,
                address: {
                    address: {
                        city: this.town.city.name,
                        citycode: this.town.city.code,
                        label: this.town.address
                    },
                    location: {
                        coordinates: [this.town.latitude, this.town.longitude],
                        zoom: 16
                    }
                },
                detailedAddress: this.town.addressDetails,
                declaredAt:
                    this.town.declaredAt !== null
                        ? this.town.declaredAt * 1000
                        : null,
                builtAt:
                    this.town.builtAt !== null
                        ? this.town.builtAt * 1000
                        : null,
                closedAt:
                    this.town.closedAt !== null
                        ? this.town.closedAt * 1000
                        : null,
                status: this.town.status !== "open" ? this.town.status : null,
                fieldType: this.town.fieldType.id,
                ownerType: this.town.ownerType.id,
                owner: this.town.owner,
                owner_complaint: boolToYesNoValue(this.town.ownerComplaint),
                justiceProcedure: boolToYesNoValue(this.town.justiceProcedure),
                justice_rendered: boolToYesNoValue(this.town.justiceRendered),
                justice_rendered_by: this.town.justiceRenderedBy,
                justice_rendered_at:
                    this.town.justiceRenderedAt !== null
                        ? this.town.justiceRenderedAt * 1000
                        : null,
                justice_challenged: boolToYesNoValue(
                    this.town.justiceChallenged
                ),
                police_status: this.town.policeStatus,
                police_requested_at:
                    this.town.policeRequestedAt !== null
                        ? this.town.policeRequestedAt * 1000
                        : null,
                police_granted_at:
                    this.town.policeGrantedAt !== null
                        ? this.town.policeGrantedAt * 1000
                        : null,
                bailiff: this.town.bailiff,
                census_status: this.town.censusStatus,
                census_conducted_at:
                    this.town.censusConductedAt !== null
                        ? this.town.censusConductedAt * 1000
                        : null,
                census_conducted_by: this.town.censusConductedBy,
                populationTotal: this.town.populationTotal,
                populationCouples: this.town.populationCouples,
                populationMinors: this.town.populationMinors,
                origins: this.town.socialOrigins.map(origin => origin.id),
                electricityType: this.town.electricityType.id,
                electricityComments: this.town.electricityComments || "",
                accessToSanitary: boolToYesNoValue(this.town.accessToSanitary),
                sanitaryComments: this.town.sanitaryComments || "",
                accessToWater: boolToYesNoValue(this.town.accessToWater),
                waterComments: this.town.waterComments || "",
                trashEvacuation: boolToYesNoValue(this.town.trashEvacuation),
                solutions: this.town.closingSolutions
                    ? this.closingSolutions.reduce((solutions, solution) => {
                          const newSolutions = Object.assign(solutions, {});
                          const s = this.town.closingSolutions.find(
                              sol => sol.id === solution.id
                          );
                          newSolutions[solution.id] = {
                              checked: s !== undefined,
                              peopleAffected: s && s.peopleAffected,
                              householdsAffected: s && s.householdsAffected
                          };

                          return newSolutions;
                      }, {})
                    : []
            };
        },
        setView(view) {
            this.setViewMode();
            this.view = view;
        },
        submit() {
            // clean previous errors
            this.editError = null;
            this.fieldErrors = {};

            // send the form
            const coordinates =
                this.edit.address &&
                this.edit.address.location &&
                this.edit.address.location.coordinates;
            const { address } = this.edit.address || {};

            function formatDate(d) {
                if (!d) {
                    return null;
                }

                if (!(d instanceof Date)) {
                    // eslint-disable-next-line no-param-reassign
                    d = new Date(d);
                }

                return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(
                    2,
                    "0"
                )}-${`${d.getDate()}`.padStart(2, "0")}`;
            }

            edit(this.town.id, {
                name: this.edit.name,
                priority: this.edit.priority || null,
                coordinates: coordinates.join(","),
                city: address && address.city,
                citycode: address && address.citycode,
                address: address && address.label,
                detailed_address: this.edit.detailedAddress,
                declared_at: formatDate(this.edit.declaredAt),
                built_at: formatDate(this.edit.builtAt),
                census_status: this.edit.census_status,
                census_conducted_at:
                    ["scheduled", "done"].indexOf(this.edit.census_status) !==
                    -1
                        ? formatDate(this.edit.census_conducted_at)
                        : null,
                census_conducted_by:
                    ["scheduled", "done"].indexOf(this.edit.census_status) !==
                    -1
                        ? this.edit.census_conducted_by
                        : "",
                population_total: this.edit.populationTotal || null,
                population_couples: this.edit.populationCouples || null,
                population_minors: this.edit.populationMinors || null,
                electricity_type: this.edit.electricityType,
                electricity_comments: this.edit.electricityComments,
                access_to_sanitary: this.edit.accessToSanitary,
                sanitary_comments: this.edit.sanitaryComments,
                access_to_water: this.edit.accessToWater,
                water_comments: this.edit.waterComments,
                trash_evacuation: this.edit.trashEvacuation,
                owner_complaint: this.edit.owner_complaint,
                justice_procedure: this.edit.justiceProcedure,
                justice_rendered:
                    this.edit.justiceProcedure === 1
                        ? this.edit.justice_rendered
                        : undefined,
                justice_rendered_by:
                    this.edit.justiceProcedure === 1 &&
                    this.edit.justice_rendered === 1
                        ? this.edit.justice_rendered_by
                        : "",
                justice_rendered_at:
                    this.edit.justiceProcedure === 1 &&
                    this.edit.justice_rendered === 1
                        ? formatDate(this.edit.justice_rendered_at)
                        : null,
                justice_challenged:
                    this.edit.justiceProcedure === 1 &&
                    this.edit.justice_rendered === 1
                        ? this.edit.justice_challenged
                        : undefined,
                police_status: this.edit.police_status,
                police_requested_at:
                    ["requested", "granted"].indexOf(
                        this.edit.police_status
                    ) !== -1
                        ? formatDate(this.edit.police_requested_at)
                        : null,
                police_granted_at:
                    ["granted"].indexOf(this.edit.police_status) !== -1
                        ? formatDate(this.edit.police_granted_at)
                        : null,
                bailiff: this.edit.bailiff,
                social_origins: this.edit.origins,
                field_type: this.edit.fieldType,
                owner_type: this.edit.ownerType,
                owner: this.edit.owner
            })
                .then(() => {
                    notify({
                        group: "notifications",
                        type: "success",
                        title: "Site correctement sauvegardé",
                        text: "Le site a bien été modifié"
                    });

                    this.loading = true;
                    this.error = null;

                    return get(this.$route.params.id)
                        .then(town => {
                            this.loading = false;
                            this.town = town;
                            this.setViewMode();
                            this.resetEdit();
                        })
                        .catch(errors => {
                            this.error = errors.user_message;
                            this.loading = false;
                        });
                })
                .catch(response => {
                    this.editError = response.user_message;
                    this.fieldErrors = response.fields || {};
                });
        },
        submitClose() {
            // clean previous errors
            this.editError = null;
            this.fieldErrors = {};

            // send the form
            close(this.town.id, {
                closed_at: this.edit.closedAt,
                closed_with_solutions: this.edit.closedWithSolutions,
                status: this.edit.status,
                solutions: Object.keys(this.edit.solutions)
                    .filter(key => this.edit.solutions[key].checked)
                    .map(key => ({
                        id: key,
                        peopleAffected: this.edit.solutions[key].peopleAffected
                            ? parseInt(
                                  this.edit.solutions[key].peopleAffected,
                                  10
                              )
                            : null,
                        householdsAffected: this.edit.solutions[key]
                            .householdsAffected
                            ? parseInt(
                                  this.edit.solutions[key].householdsAffected,
                                  10
                              )
                            : null
                    }))
            })
                .then(() => {
                    notify({
                        group: "notifications",
                        type: "success",
                        title: "Site correctement fermé",
                        text: "Le site a bien été marqué comme fermé"
                    });

                    this.loading = true;
                    this.error = null;

                    return get(this.$route.params.id)
                        .then(town => {
                            this.loading = false;
                            this.town = town;
                            this.setViewMode();
                            this.resetEdit();
                        })
                        .catch(errors => {
                            this.error = errors.user_message;
                            this.loading = false;
                        });
                })
                .catch(response => {
                    this.editError = response.user_message;
                    this.fieldErrors = response.fields || {};
                });
        },
        destroy() {
            // eslint-disable-next-line
            const confirmed = confirm('Êtes-vous sûr ? Cette suppression est irréversible');

            if (confirmed === true) {
                destroy(this.$route.params.id)
                    .then(() => {
                        this.$router.push("/liste-des-sites");
                    })
                    .catch(error => {
                        this.deleteError = error.user_message;
                    });
            }
        },
        addComment() {
            if (!hasPermission("shantytown_comment.create")) {
                return;
            }

            // clean previous errors
            this.commentError = null;
            this.commentErrors = {};

            addComment(this.$route.params.id, {
                description: this.newComment
            })
                .then(response => {
                    this.town.comments.regular = response.comments;
                    this.newComment = "";
                    this.newStep = "";
                })
                .catch(response => {
                    this.commentError = response.user_message;
                    this.commentErrors = response.fields || {};
                });
        },
        addCovidComment() {
            // clean previous errors
            this.covidErrors = [];

            addCovidComment(this.$route.params.id, this.covidComment)
                .then(response => {
                    this.town.comments.covid = response;
                    this.covidComment = {
                        date: new Date(),
                        description: "",
                        equipe_maraude: false,
                        equipe_sanitaire: false,
                        equipe_accompagnement: false,
                        distribution_alimentaire: false,
                        personnes_orientees: false,
                        personnes_avec_symptomes: false,
                        besoin_action: false
                    };
                })
                .catch(response => {
                    const fields = response.fields || {};
                    this.covidErrors = Object.keys(fields).reduce(
                        (acc, key) => [...acc, ...fields[key]],
                        []
                    );
                });
        },
        formatSolution(solution) {
            const details = [];
            if (solution.householdsAffected !== null) {
                const plural = solution.householdsAffected > 1 ? "s" : "";
                details.push(
                    `${solution.householdsAffected} ménage${plural} concerné${plural}`
                );
            }

            if (solution.peopleAffected !== null) {
                const plural = solution.peopleAffected > 1 ? "s" : "";
                details.push(
                    `${solution.peopleAffected} personne${plural} concernée${plural}`
                );
            }

            if (details.length > 0) {
                return details;
            }

            return [
                "aucun détail sur le nombre de ménages/personnes concernés"
            ];
        },
        canEditComment(comment) {
            return (
                hasPermission("shantytown_comment.create") ||
                comment.createdBy.id === this.userId
            );
        },
        canDeleteComment(comment) {
            return (
                hasPermission("shantytown_comment.delete") ||
                comment.createdBy.id === this.userId
            );
        },
        editComment(comment) {
            this.commentEdit.commentId = comment.id;
            this.commentEdit.value = comment.description;
            this.commentEdit.pending = false;
            this.commentEdit.error = null;
        },
        deleteComment(comment) {
            this.commentToBeDeleted = {
                id: comment.id,
                date: comment.createdAt,
                shantytown: {
                    id: this.town.id,
                    usename: this.town.usename,
                    city: this.town.city.name
                },
                author: {
                    name: `${
                        comment.createdBy.firstName
                    } ${comment.createdBy.lastName.toUpperCase()}`
                },
                content: comment.description
            };
        },
        sendEditComment(comment) {
            if (this.commentEdit.pending !== false) {
                return;
            }

            this.commentEdit.pending = true;
            this.commentEdit.error = null;

            editComment(this.$route.params.id, comment.id, {
                description: this.commentEdit.value
            })
                .then(response => {
                    this.town.comments.regular = response.comments;
                    this.commentEdit.commentId = null;
                    this.commentEdit.value = null;
                    this.commentEdit.pending = false;
                    this.commentEdit.error = null;

                    notify({
                        group: "notifications",
                        type: "success",
                        title: "Opération réussie",
                        text: "Le commentaire a bien été modifié"
                    });
                })
                .catch(response => {
                    this.commentEdit.pending = false;
                    this.commentEdit.error = response.user_message;
                });
        },
        cancelEditComment() {
            setTimeout(() => {
                if (this.commentEdit.pending !== false) {
                    return;
                }

                this.commentEdit.commentId = null;
                this.commentEdit.value = null;
                this.commentEdit.pending = false;
                this.commentEdit.error = null;
            }, 100);
        },
        closeCommentDeletion() {
            setTimeout(() => {
                this.commentToBeDeleted = null;
            }, 100);
        },
        onCommentDeleted() {
            this.town.comments.regular = this.town.comments.regular.filter(
                ({ id }) => id !== this.commentToBeDeleted.id
            );
            this.commentToBeDeleted = null;

            notify({
                group: "notifications",
                type: "success",
                title: "Commentaire supprimé",
                text: "L'auteur du commentaire en a été notifié par email"
            });
        }
    }
};
