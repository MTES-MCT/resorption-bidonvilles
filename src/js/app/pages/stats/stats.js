import { all } from '#helpers/api/stats';
import NavBar from '#app/layouts/navbar/navbar.vue';

export default {
    components: {
        NavBar,
    },

    data() {
        return {
            status: null,
            error: null,
            stats: null,
            sections: [
                {
                    id: 'created',
                    title: 'Nombre de sites créés',
                },
                {
                    id: 'updated',
                    title: 'Nombre de sites modifiés',
                },
                {
                    id: 'closed',
                    title: 'Nombre de sites fermés',
                },
            ],
        };
    },

    mounted() {
        this.load();
    },

    methods: {
        load() {
            if (this.status === 'loaded' || this.status === 'loading') {
                return;
            }

            this.status = 'loading';
            this.error = null;

            all()
                .then(({ statistics: stats }) => {
                    this.stats = stats;
                    this.status = 'loaded';
                })
                .catch(({ user_message: userMessage }) => {
                    this.status = 'error';
                    this.error = userMessage;
                });
        },
    },
};
