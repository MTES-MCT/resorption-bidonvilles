import NavBar from '#app/layouts/navbar/navbar.vue';
import Map from '#app/pages/townExplorer/map/map.vue';
import { get } from '#helpers/configHelper';
import Datepicker from 'vuejs-datepicker';
import { fr } from 'vuejs-datepicker/dist/locale';

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
            detailedAddress: '',
            builtAt: '',
            fieldType: null,
            ownerType: null,
            populationTotal: '',
            populationCouples: '',
            populationMinors: '',
            origins: [],
            accessToElectricity: '',
            accessToWater: '',
            trashEvacuation: '',
            yesnoValues: [
                { value: -1, label: 'Inconnu' },
                { value: 1, label: 'Oui' },
                { value: 0, label: 'Non' },
            ],
        };
    },
    methods: {
        submit() {
            // console.log(this.address, this.detailedAddress, this.builtAt, this.fieldType, this.ownerType, this.populationTotal, this.populationCouples, this.populationMinors, this.origins, this.accessToElectricity, this.accessToWater, this.trashEvacuation);
        },
    },
};
