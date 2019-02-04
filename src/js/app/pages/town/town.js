import NavBar from '#app/layouts/navbar/navbar.vue';
import Map from '#app/pages/townExplorer/map/map.vue';
import {
    get, edit, destroy, addComment,
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
            dateLanguage: fr,
            yesnoValues: [
                { value: -1, label: 'Inconnu' },
                { value: 1, label: 'Oui' },
                { value: 0, label: 'Non' },
            ],
            statusValues: [
                { value: 'gone', label: 'Disparu' },
                { value: 'expelled', label: 'Expulsé' },
                { value: 'covered', label: 'Résorbé' },
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

            case 'gone':
            case 'covered':
            case 'expelled':
                return 'n\'existe plus';

            default:
                return 'inconnu';
            }
        },
        center() {
            return {
                center: [this.town.latitude, this.town.longitude],
                zoom: 13,
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
                justiceStatus: boolToYesNoValue(this.town.justiceStatus),
                populationTotal: this.town.populationTotal,
                populationCouples: this.town.populationCouples,
                populationMinors: this.town.populationMinors,
                origins: this.town.socialOrigins.map(origin => origin.id),
                accessToElectricity: boolToYesNoValue(this.town.accessToElectricity),
                accessToWater: boolToYesNoValue(this.town.accessToWater),
                trashEvacuation: boolToYesNoValue(this.town.trashEvacuation),
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
                justice_status: this.edit.justiceStatus,
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
    },
};
