import NavBar from '#app/layouts/navbar/navbar.vue';
import Map from '#app/pages/townExplorer/map/map.vue';
import { get } from '#helpers/api/town';

export default {
    components: {
        NavBar,
        Map,
    },
    data() {
        return {
            loading: false,
            error: null,
            town: null,
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
                })
                .catch((errors) => {
                    this.error = errors.user_message;
                    this.loading = false;
                });
        },
    },
};
