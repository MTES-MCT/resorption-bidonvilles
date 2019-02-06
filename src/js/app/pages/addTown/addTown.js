import NavBar from '#app/layouts/navbar/navbar.vue';
import Map from '#app/pages/townExplorer/map/map.vue';
import { get } from '#helpers/api/config';
import Datepicker from 'vuejs-datepicker';
import { fr } from 'vuejs-datepicker/dist/locale';
import { add } from '#helpers/api/town';

export default {
    components: {
        NavBar,
        Map,
        Datepicker,
    },
    data() {
        return {
            steps: [
                {
                    id: 'geography',
                    label: 'Caractéristiques',
                },
                {
                    id: 'demography',
                    label: 'Démographie',
                },
                {
                    id: 'life_conditions',
                    label: 'Conditions de vie',
                },
            ],
            fieldTypes: get().field_types,
            ownerTypes: get().owner_types,
            socialOrigins: get().social_origins,
            dateLanguage: fr,
            address: {},
            priority: 3,
            detailedAddress: '',
            builtAt: '',
            fieldType: null,
            ownerType: null,
            populationTotal: '',
            populationCouples: '',
            populationMinors: '',
            origins: [],
            accessToElectricity: null,
            accessToWater: null,
            trashEvacuation: null,
            justiceStatus: null,
            declared_at: '',
            owner: '',
            census_status: null,
            census_requested_at: '',
            census_conducted_at: '',
            census_conducted_by: '',
            justice_rendered_by: '',
            justice_rendered_at: '',
            police_status: null,
            police_requested_at: '',
            police_granted_at: '',
            bailiff: '',
            yesnoValues: [
                { value: -1, label: 'Inconnu' },
                { value: 1, label: 'Oui' },
                { value: 0, label: 'Non' },
            ],
            diagnosisValues: [
                { value: 'none', label: 'Non prévu' },
                { value: 'scheduled', label: 'Prévu' },
                { value: 'done', label: 'Réalisé' },
            ],
            justiceValues: [
                { value: 'none', label: 'Juge non saisi' },
                { value: 'seized', label: 'Juge saisi' },
                { value: 'rendered', label: 'Décision rendue' },
            ],
            cfpValues: [
                { value: 'none', label: 'Aucun' },
                { value: 'requested', label: 'Demandé' },
                { value: 'granted', label: 'Obtenu' },
            ],
            error: null,
            fieldErrors: {},
        };
    },
    methods: {
        submit() {
            // clean previous errors
            this.error = null;
            this.fieldErrors = {};

            // send the form
            const coordinates = this.address && this.address.coordinates;

            add({
                priority: this.priority,
                latitude: coordinates && coordinates[0],
                longitude: coordinates && coordinates[1],
                city: this.address && this.address.city,
                citycode: this.address && this.address.citycode,
                address: this.address && this.address.label,
                detailed_address: this.detailedAddress,
                built_at: this.builtAt,
                population_total: this.populationTotal,
                population_couples: this.populationCouples,
                population_minors: this.populationMinors,
                access_to_electricity: this.accessToElectricity,
                access_to_water: this.accessToWater,
                trash_evacuation: this.trashEvacuation,
                justice_status: this.justiceStatus,
                social_origins: this.origins,
                field_type: this.fieldType,
                owner_type: this.ownerType,
                declared_at: this.declared_at,
                owner: this.owner,
                census_status: this.census_status,
                census_requested_at: this.census_requested_at,
                census_conducted_at: this.census_conducted_at,
                census_conducted_by: this.census_conducted_by,
                justice_rendered_by: this.justice_rendered_by,
                justice_rendered_at: this.justice_rendered_at,
                police_status: this.police_status,
                police_requested_at: this.police_requested_at,
                police_granted_at: this.police_granted_at,
                bailiff: this.bailiff,
            })
                .then(() => {
                    this.$router.push('/liste-des-sites');
                })
                .catch((response) => {
                    this.error = response.user_message;
                    this.fieldErrors = response.fields || {};
                });
        },
    },
};
