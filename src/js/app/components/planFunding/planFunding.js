import { get as getConfig } from '#helpers/api/config';

export default {
    props: {
        value: {
            type: Array,
            default: [],
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            newFunding: {
                type: null,
            },
            rows: this.value,
            fundingTypes: getConfig().fundingTypes || [
                { id: 1, label: 'Financements étatiques hors crédits dédiés', allowsDetails: true },
                { id: 2, label: 'Crédits dédiés à la résorption des bidonvilles', allowsDetails: false },
                { id: 3, label: 'Cofinancement collectivité territoriale', allowsDetails: true },
                { id: 4, label: 'Financement européen', allowsDetails: true },
                { id: 5, label: 'Financement privé', allowsDetails: true },
                { id: 6, label: 'Autre', allowsDetails: true },
            ],
        };
    },

    watch: {
        rows() {
            this.$emit('input', this.rows);
        },
    },

    methods: {
        getFundingType(id) {
            return this.fundingTypes.find(({ id: typeId }) => typeId === id) || null;
        },

        addRow() {
            if (this.disabled) {
                return;
            }

            this.rows.push({
                type: null,
                amount: 0,
                details: '',
            });
        },

        removeRow(index) {
            if (this.disabled) {
                return;
            }

            this.rows.splice(index, 1);
        },
    },
};
