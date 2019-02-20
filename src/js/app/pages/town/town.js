import NavBar from '#app/layouts/navbar/navbar.vue';
import Map from '#app/pages/townExplorer/map/map.vue';
import {
    get, close, edit, destroy, addComment,
} from '#helpers/api/town';
import { get as getConfig } from '#helpers/api/config';
import Datepicker from 'vuejs-datepicker';
import { fr } from 'vuejs-datepicker/dist/locale';

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
        Datepicker,
    },
    data() {
        return {
            loading: false,
            error: null,
            town: null,
            view: 'details',
            mode: 'view',
            editError: null,
            deleteError: null,
            fieldErrors: {},
            fieldTypes: getConfig().field_types,
            ownerTypes: getConfig().owner_types,
            socialOrigins: getConfig().social_origins,
            closingSolutions: getConfig().closing_solutions,
            dateLanguage: fr,
            yesnoValues: [
                { value: -1, label: 'Inconnu' },
                { value: 1, label: 'Oui' },
                { value: 0, label: 'Non' },
            ],
            statusValues: [
                { value: 'closed_by_justice', label: 'Exécution d\'une décision de justice' },
                { value: 'closed_by_admin', label: 'Exécution d\'une décision administrative' },
                { value: 'other', label: 'Autre' },
                { value: 'unknown', label: 'Raison inconnue' },
            ],
            newComment: '',
            commentError: null,
            commentErrors: {},
            edit: null,
        };
    },
    computed: {
        status() {
            if (this.town === null) {
                return null;
            }

            switch (this.town.status) {
            case 'open':
                return 'existe toujours';

            case 'closed_by_justice':
            case 'closed_by_admin':
            case 'other':
            case 'unknown':
                return 'disparu';

            default:
                return 'inconnu';
            }
        },
        statusLabel() {
            if (this.town === null) {
                return 'inconnu';
            }

            switch (this.town.status) {
            case 'closed_by_justice':
                return 'Exécution d\'une décision de justice';

            case 'closed_by_admin':
                return 'Exécution d\'une décision administrative';

            case 'other':
                return 'Autre';

            default:
                return 'inconnu';
            }
        },
        center() {
            return {
                center: [this.town.latitude, this.town.longitude],
                zoom: 15,
            };
        },
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            if (this.loading === true) {
                return;
            }

            this.loading = true;
            this.error = null;

            get(this.$route.params.id)
                .then((town) => {
                    this.loading = false;
                    this.town = town;
                    this.resetEdit();
                })
                .catch((errors) => {
                    this.error = errors.user_message;
                    this.loading = false;
                });
        },
        setViewMode() {
            this.mode = 'view';
        },
        setEditMode() {
            this.setView('details');
            this.resetEdit();
            this.mode = 'edit';
        },
        setCloseMode() {
            this.resetEdit();
            this.mode = 'close';
        },
        closeAlert() {
            this.resetEdit();
            this.mode = 'view';
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
                address: {
                    city: this.town.city.name,
                    citycode: this.town.city.code,
                    label: this.town.address,
                    coordinates: [this.town.latitude, this.town.longitude],
                },
                detailedAddress: this.town.addressDetails,
                builtAt: this.town.builtAt * 1000,
                closedAt: this.town.closedAt !== null ? this.town.closedAt * 1000 : null,
                status: this.town.status !== 'open' ? this.town.status : null,
                fieldType: this.town.fieldType.id,
                ownerType: this.town.ownerType.id,
                justiceProcedure: boolToYesNoValue(this.town.justiceProcedure),
                populationTotal: this.town.populationTotal,
                populationCouples: this.town.populationCouples,
                populationMinors: this.town.populationMinors,
                origins: this.town.socialOrigins.map(origin => origin.id),
                accessToElectricity: boolToYesNoValue(this.town.accessToElectricity),
                accessToWater: boolToYesNoValue(this.town.accessToWater),
                trashEvacuation: boolToYesNoValue(this.town.trashEvacuation),
                solutions: this.closingSolutions.reduce((solutions, solution) => {
                    const newSolutions = Object.assign(solutions, {});
                    const s = this.town.closingSolutions.find(sol => sol.id === solution.id);
                    newSolutions[solution.id] = {
                        checked: s !== undefined,
                        peopleAffected: s && s.peopleAffected,
                        householdsAffected: s && s.householdsAffected,
                    };

                    return newSolutions;
                }, {}),
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
            const coordinates = this.edit.address && this.edit.address.coordinates;

            edit(this.town.id, {
                priority: this.edit.priority,
                latitude: coordinates && coordinates[0],
                longitude: coordinates && coordinates[1],
                city: this.edit.address && this.edit.address.city,
                citycode: this.edit.address && this.edit.address.citycode,
                address: this.edit.address && this.edit.address.label,
                detailed_address: this.edit.detailedAddress,
                built_at: this.edit.builtAt,
                closed_at: this.edit.closedAt,
                status: this.edit.closedAt !== null ? this.edit.status : 'open',
                population_total: this.edit.populationTotal,
                population_couples: this.edit.populationCouples,
                population_minors: this.edit.populationMinors,
                access_to_electricity: this.edit.accessToElectricity,
                access_to_water: this.edit.accessToWater,
                trash_evacuation: this.edit.trashEvacuation,
                justice_procedure: this.edit.justiceProcedure,
                social_origins: this.edit.origins,
                field_type: this.edit.fieldType,
                owner_type: this.edit.ownerType,
            })
                .then(() => {
                    this.$router.go();
                })
                .catch((response) => {
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
                status: this.edit.status,
                solutions: Object.keys(this.edit.solutions)
                    .filter(key => this.edit.solutions[key].checked)
                    .map(key => ({
                        id: key,
                        peopleAffected: this.edit.solutions[key].peopleAffected ? parseInt(this.edit.solutions[key].peopleAffected, 10) : null,
                        householdsAffected: this.edit.solutions[key].householdsAffected ? parseInt(this.edit.solutions[key].householdsAffected, 10) : null,
                    })),
            })
                .then(() => {
                    this.$router.go();
                })
                .catch((response) => {
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
                        this.$router.push('/liste-des-sites');
                    })
                    .catch((error) => {
                        this.deleteError = error.user_message;
                    });
            }
        },
        addComment() {
            // clean previous errors
            this.commentError = null;
            this.commentErrors = {};

            addComment(this.$route.params.id, {
                description: this.newComment,
            })
                .then((response) => {
                    this.town.comments = response.comments;
                    this.newStep = '';
                })
                .catch((response) => {
                    this.commentError = response.user_message;
                    this.commentErrors = response.fields || {};
                });
        },
        formatSolution(solution) {
            const details = [];
            if (solution.householdsAffected !== null) {
                const plural = solution.householdsAffected > 1 ? 's' : '';
                details.push(`${solution.householdsAffected} ménage${plural} concerné${plural}`);
            }

            if (solution.peopleAffected !== null) {
                const plural = solution.peopleAffected > 1 ? 's' : '';
                details.push(`${solution.peopleAffected} personne${plural} concernée${plural}`);
            }

            if (details.length > 0) {
                return details;
            }

            return ['aucun détail sur le nombre de ménages/personnes concernés'];
        },
    },
};
