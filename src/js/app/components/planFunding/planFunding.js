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
            fundingTypes: getConfig().funding_types || [],
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
