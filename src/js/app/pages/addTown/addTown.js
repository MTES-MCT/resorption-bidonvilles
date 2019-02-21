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
            declared_at: '',
            owner: '',
            census_status: undefined,
            census_conducted_at: '',
            census_conducted_by: '',
            owner_complaint: undefined,
            justice_procedure: undefined,
            justice_rendered: -1,
            justice_rendered_by: '',
            justice_rendered_at: '',
            justice_challenged: -1,
            police_status: undefined,
            police_requested_at: '',
            police_granted_at: '',
            bailiff: '',
            yesnoValues: [
                { value: -1, label: 'Inconnu' },
                { value: 1, label: 'Oui' },
                { value: 0, label: 'Non' },
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
                social_origins: this.origins,
                field_type: this.fieldType,
                owner_type: this.ownerType,
                declared_at: this.declared_at,
                owner: this.owner,
                census_status: this.census_status,
                census_conducted_at: ['scheduled', 'done'].indexOf(this.census_status) !== -1 ? this.census_conducted_at : null,
                census_conducted_by: ['scheduled', 'done'].indexOf(this.census_status) !== -1 ? this.census_conducted_by : '',
                owner_complaint: this.owner_complaint,
                justice_procedure: this.owner_complaint === 1 ? this.justice_procedure : undefined,
                justice_rendered: this.owner_complaint === 1
                    && this.justice_procedure === 1 ? this.justice_rendered : undefined,
                justice_rendered_by: this.owner_complaint === 1
                    && this.justice_procedure === 1
                    && this.justice_rendered === 1 ? this.justice_rendered_by : '',
                justice_rendered_at: this.owner_complaint === 1
                    && this.justice_procedure === 1
                    && this.justice_rendered === 1 ? this.justice_rendered_at : null,
                justice_challenged: this.owner_complaint === 1
                    && this.justice_procedure === 1
                    && this.justice_rendered === 1 ? this.justice_challenged : undefined,
                police_status: this.police_status,
                police_requested_at: ['requested', 'granted'].indexOf(this.police_status) !== -1 ? this.police_requested_at : null,
                police_granted_at: ['granted'].indexOf(this.police_status) !== -1 ? this.police_granted_at : null,
                bailiff: this.bailiff,
            })
                .then((response) => {
                    this.$notify({
                        group: 'notifications',
                        type: 'success',
                        title: 'Site correctement sauvegardé',
                        text: `Le site de ${this.address.city} a bien été ajouté en base de données`,
                    });

                    this.$router.push(`/site/${response.id}`);
                })
                .catch((response) => {
                    this.error = response.user_message;
                    this.fieldErrors = response.fields || {};
                });
        },
    },
};
