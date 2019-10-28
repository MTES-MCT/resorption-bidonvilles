import simplebar from 'simplebar-vue';
import Datepicker from 'vuejs-datepicker';
import { fr } from 'vuejs-datepicker/dist/locale';
import NavBar from '#app/layouts/navbar/navbar.vue';
import Map from '#app/pages/townExplorer/map/map.vue';
import {
    get, close, edit, destroy, addComment, editComment, deleteComment,
} from '#helpers/api/town';
import { get as getConfig, hasPermission } from '#helpers/api/config';
import { notify } from '#helpers/notificationHelper';

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
        simplebar,
    },
    data() {
        return {
            userId: getConfig().user.id,
            loading: false,
            error: null,
            town: null,
            view: 'details',
            mode: 'view',
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
            diagnosisValues: [
                { value: null, label: 'Inconnu' },
                { value: 'none', label: 'Non prévu' },
                { value: 'scheduled', label: 'Prévu' },
                { value: 'done', label: 'Réalisé' },
            ],
            cfpValues: [
                { value: null, label: 'Inconnu' },
                { value: 'none', label: 'Non demandé' },
                { value: 'requested', label: 'Demandé' },
                { value: 'granted', label: 'Obtenu' },
            ],
            newComment: '',
            showComments: false,
            commentError: null,
            commentErrors: {},
            edit: null,
            commentEdit: {
                commentId: null,
                value: null,
                pending: false,
                error: null,
            },
        };
    },
    computed: {
        status() {
            if (this.town === null) {
                return null;
            }

            switch (this.town.status) {
            case 'open':
                return 'existe';

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
    mounted() {
        this.scroll = window.pageYOffset;
        window.addEventListener('scroll', this.stickTheHeader);
    },
    destroyed() {
        window.removeEventListener('scroll', this.stickTheHeader);
        document.body.removeEventListener('click', this.checkClickOutsideAside);
    },
    created() {
        this.fetchData();
    },
    methods: {
        showAside() {
            this.showComments = true;
            setTimeout(() => {
                document.body.addEventListener('click', this.checkClickOutsideAside);
            }, 100);
        },
        hideAside() {
            this.showComments = false;
            document.body.removeEventListener('click', this.checkClickOutsideAside);
        },
        checkClickOutsideAside(event) {
            if (!this.$refs.aside.$el.contains(event.target)) {
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

            if (goesUp === true) {
                if (window.pageYOffset - this.$refs.main.offsetTop <= 0) {
                    this.$refs.wrapper.classList.remove('sticky');
                    this.$refs.aside.$el.style.top = 0;
                }
            } else if (window.pageYOffset > this.offsetTop(this.$refs.header)) {
                this.$refs.wrapper.classList.add('sticky');
                this.$refs.aside.$el.style.top = `${this.$refs.header.offsetTop + this.$refs.header.offsetHeight}px`;
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
            if (!hasPermission('shantytown.update')) {
                return;
            }

            this.setView('details');
            this.resetEdit();
            this.mode = 'edit';
        },
        setCloseMode() {
            if (!hasPermission('shantytown.close')) {
                return;
            }

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
                declaredAt: this.town.declaredAt !== null ? this.town.declaredAt * 1000 : null,
                builtAt: this.town.builtAt !== null ? this.town.builtAt * 1000 : null,
                closedAt: this.town.closedAt !== null ? this.town.closedAt * 1000 : null,
                status: this.town.status !== 'open' ? this.town.status : null,
                fieldType: this.town.fieldType.id,
                ownerType: this.town.ownerType.id,
                owner: this.town.owner,
                owner_complaint: boolToYesNoValue(this.town.ownerComplaint),
                justiceProcedure: boolToYesNoValue(this.town.justiceProcedure),
                justice_rendered: boolToYesNoValue(this.town.justiceRendered),
                justice_rendered_by: this.town.justiceRenderedBy,
                justice_rendered_at: this.town.justiceRenderedAt !== null ? this.town.justiceRenderedAt * 1000 : null,
                justice_challenged: boolToYesNoValue(this.town.justiceChallenged),
                police_status: this.town.policeStatus,
                police_requested_at: this.town.policeRequestedAt !== null ? this.town.policeRequestedAt * 1000 : null,
                police_granted_at: this.town.policeGrantedAt !== null ? this.town.policeGrantedAt * 1000 : null,
                bailiff: this.town.bailiff,
                census_status: this.town.censusStatus,
                census_conducted_at: this.town.censusConductedAt !== null ? this.town.censusConductedAt * 1000 : null,
                census_conducted_by: this.town.censusConductedBy,
                populationTotal: this.town.populationTotal,
                populationCouples: this.town.populationCouples,
                populationMinors: this.town.populationMinors,
                origins: this.town.socialOrigins.map(origin => origin.id),
                electricityType: this.town.electricityType.id,
                accessToWater: boolToYesNoValue(this.town.accessToWater),
                trashEvacuation: boolToYesNoValue(this.town.trashEvacuation),
                solutions: this.town.closingSolutions ? this.closingSolutions.reduce((solutions, solution) => {
                    const newSolutions = Object.assign(solutions, {});
                    const s = this.town.closingSolutions.find(sol => sol.id === solution.id);
                    newSolutions[solution.id] = {
                        checked: s !== undefined,
                        peopleAffected: s && s.peopleAffected,
                        householdsAffected: s && s.householdsAffected,
                    };

                    return newSolutions;
                }, {}) : [],
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
                priority: this.edit.priority || null,
                latitude: coordinates && coordinates[0],
                longitude: coordinates && coordinates[1],
                city: this.edit.address && this.edit.address.city,
                citycode: this.edit.address && this.edit.address.citycode,
                address: this.edit.address && this.edit.address.label,
                detailed_address: this.edit.detailedAddress,
                declared_at: this.edit.declaredAt,
                built_at: this.edit.builtAt,
                closed_at: this.edit.closedAt,
                status: 'open',
                census_status: this.edit.census_status,
                census_conducted_at: ['scheduled', 'done'].indexOf(this.edit.census_status) !== -1 ? this.edit.census_conducted_at : null,
                census_conducted_by: ['scheduled', 'done'].indexOf(this.edit.census_status) !== -1 ? this.edit.census_conducted_by : '',
                population_total: this.edit.populationTotal,
                population_couples: this.edit.populationCouples,
                population_minors: this.edit.populationMinors,
                electricity_type: this.edit.electricityType,
                access_to_water: this.edit.accessToWater,
                trash_evacuation: this.edit.trashEvacuation,
                owner_complaint: this.edit.owner_complaint,
                justice_procedure: this.edit.owner_complaint === 1 ? this.edit.justiceProcedure : undefined,
                justice_rendered: this.edit.owner_complaint === 1
                    && this.edit.justiceProcedure === 1 ? this.edit.justice_rendered : undefined,
                justice_rendered_by: this.edit.owner_complaint === 1
                    && this.edit.justiceProcedure === 1
                    && this.edit.justice_rendered === 1 ? this.edit.justice_rendered_by : '',
                justice_rendered_at: this.edit.owner_complaint === 1
                    && this.edit.justiceProcedure === 1
                    && this.edit.justice_rendered === 1 ? this.edit.justice_rendered_at : null,
                justice_challenged: this.edit.owner_complaint === 1
                    && this.edit.justiceProcedure === 1
                    && this.edit.justice_rendered === 1 ? this.edit.justice_challenged : undefined,
                police_status: this.edit.police_status,
                police_requested_at: ['requested', 'granted'].indexOf(this.edit.police_status) !== -1 ? this.edit.police_requested_at : null,
                police_granted_at: ['granted'].indexOf(this.edit.police_status) !== -1 ? this.edit.police_granted_at : null,
                bailiff: this.edit.bailiff,
                social_origins: this.edit.origins,
                field_type: this.edit.fieldType,
                owner_type: this.edit.ownerType,
                owner: this.edit.owner,
            })
                .then(() => {
                    notify({
                        group: 'notifications',
                        type: 'success',
                        title: 'Site correctement sauvegardé',
                        text: 'Le site a bien été modifié',
                    });

                    this.loading = true;
                    this.error = null;

                    return get(this.$route.params.id)
                        .then((town) => {
                            this.loading = false;
                            this.town = town;
                            this.setViewMode();
                            this.resetEdit();
                        })
                        .catch((errors) => {
                            this.error = errors.user_message;
                            this.loading = false;
                        });
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
                    notify({
                        group: 'notifications',
                        type: 'success',
                        title: 'Site correctement fermé',
                        text: 'Le site a bien été marqué comme fermé',
                    });

                    this.loading = true;
                    this.error = null;

                    return get(this.$route.params.id)
                        .then((town) => {
                            this.loading = false;
                            this.town = town;
                            this.setViewMode();
                            this.resetEdit();
                        })
                        .catch((errors) => {
                            this.error = errors.user_message;
                            this.loading = false;
                        });
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
            if (!hasPermission('shantytown_comment.create')) {
                return;
            }

            // clean previous errors
            this.commentError = null;
            this.commentErrors = {};

            addComment(this.$route.params.id, {
                description: this.newComment,
            })
                .then((response) => {
                    this.town.comments = response.comments;
                    this.newComment = '';
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
        canEditComment(comment) {
            return hasPermission('shantytown_comment.create') || (comment.createdBy.id === this.userId);
        },
        canDeleteComment(comment) {
            return hasPermission('shantytown_comment.delete') || (comment.createdBy.id === this.userId);
        },
        editComment(comment) {
            this.commentEdit.commentId = comment.id;
            this.commentEdit.value = comment.description;
            this.commentEdit.pending = false;
            this.commentEdit.error = null;
        },
        deleteComment(comment) {
            // eslint-disable-next-line
            if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ? La suppression est définitive.')) {
                return;
            }

            deleteComment(this.$route.params.id, comment.id)
                .then((response) => {
                    this.town.comments = response.comments;
                    notify({
                        group: 'notifications',
                        type: 'success',
                        title: 'Opération réussie',
                        text: 'Le commentaire a bien été supprimé',
                    });
                });
        },
        sendEditComment(comment) {
            if (this.commentEdit.pending !== false) {
                return;
            }

            this.commentEdit.pending = true;
            this.commentEdit.error = null;

            editComment(this.$route.params.id, comment.id, { description: this.commentEdit.value })
                .then((response) => {
                    this.town.comments = response.comments;
                    this.commentEdit.commentId = null;
                    this.commentEdit.value = null;
                    this.commentEdit.pending = false;
                    this.commentEdit.error = null;

                    notify({
                        group: 'notifications',
                        type: 'success',
                        title: 'Opération réussie',
                        text: 'Le commentaire a bien été modifié',
                    });
                })
                .catch((response) => {
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
    },
};
