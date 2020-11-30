import { all } from "#helpers/api/stats";
import NavBar from "#app/layouts/navbar/navbar.vue";

export default {
    components: {
        NavBar
    },

    data() {
        return {
            status: null,
            error: null,
            stats: null,
            sections: [
                {
                    id: "creations",
                    title: "Nombre de sites créés"
                },
                {
                    id: "updates",
                    title: "Nombre de sites modifiés"
                },
                {
                    id: "closings",
                    title: "Nombre de sites fermés"
                }
            ]
        };
    },

    mounted() {
        this.load();
    },

    methods: {
        load() {
            if (this.status === "loaded" || this.status === "loading") {
                return;
            }

            this.status = "loading";
            this.error = null;

            all()
                .then(({ statistics: stats }) => {
                    this.stats = stats;
                    this.status = "loaded";
                })
                .catch(({ user_message: userMessage }) => {
                    this.status = "error";
                    this.error = userMessage;
                });
        },
        computeTotal(sectionId) {
            return this.stats.numberOfShantytownOperations[sectionId].reduce(
                (sum, { total }) => sum + parseInt(total, 10),
                0
            );
        }
    }
};
