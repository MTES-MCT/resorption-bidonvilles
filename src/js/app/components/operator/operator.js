import Autocompleter from '#app/components/address/address.vue';
import { Promise } from 'q';

export default {
    components: {
        Autocompleter,
    },

    data() {
        return {
            operator: null,
        };
    },

    methods: {
        searchOperator(str) {
            const p = Promise.resolve([
                { label: 'a' },
            ]);
            p.abort = () => {};
            return p;
        },
    },
};
