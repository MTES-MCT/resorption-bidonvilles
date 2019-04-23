import Autocompleter from '#app/components/address/address.vue';
import { search } from '#helpers/api/operator';

export default {
    components: {
        Autocompleter,
    },

    data() {
        return {
            operator: null,
        };
    },

    watch: {
        operator() {
            this.$emit('input', this.operator);
        },
    },

    methods: {
        searchOperator(str) {
            return search(str);
        },
    },
};
