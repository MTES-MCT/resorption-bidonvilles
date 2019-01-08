import NavBar from '#app/layouts/navbar/navbar.vue';
import FilterGroup from '../townExplorer/filterGroup/filterGroup.vue';
import Table from './table/table.vue';
import { all as fetchAll } from '#helpers/api/action';

export default {
    components: {
        NavBar,
        FilterGroup,
        Table,
    },
    data() {
        return {
            error: undefined,
            loading: false,
            actions: [],
            filters: [],
        };
    },
    computed: {
        visibleActions() {
            return this.actions;
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
            this.error = undefined;

            fetchAll()
                .then((actions) => {
                    this.loading = false;
                    this.actions = actions;
                })
                .catch((errors) => {
                    this.error = errors.user_message;
                    this.loading = false;
                });
        },
    },
};
