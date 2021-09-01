import { VueGoodTable as Table } from "vue-good-table";
import { getRecentComments } from "#helpers/api/town";
import NavBar from "#app/layouts/navbar/navbar.vue";
import { open } from "#helpers/tabHelper";
import "vue-good-table/dist/vue-good-table.css";

export default {
    components: {
        NavBar,
        Table
    },

    data() {
        return {
            /**
             * List of comments
             *
             * @type {Array.<Comment>}
             */
            comments: [],

            /**
             * The error's user message
             *
             * Obivously, null if there is no error
             *
             * @type {string|null}
             */
            error: null,

            /**
             * The current state of the page
             *
             * One out of: 'loading', 'error', or 'loaded'
             *
             * @type {string|null}
             */
            state: null
        };
    },

    computed: {
        tableProperties() {
            return {
                columns: [
                    {
                        id: "comment",
                        label: "COMMENTAIRE",
                        field: "description"
                    },
                    {
                        id: "author",
                        label: "AUTEUR",
                        field: comment =>
                            `${comment.createdBy.lastName.toUpperCase()} ${
                                comment.createdBy.firstName
                            } (${comment.createdBy.position} - ${
                                comment.createdBy.organization
                            })`
                    },
                    {
                        id: "see",
                        label: "",
                        field: () => true
                    }
                ],
                rows: this.comments
            };
        }
    },

    created() {
        this.load();
    },

    methods: {
        /**
         * Tries fetching the data from the API
         *
         * Please note that this cannot be done if the data has already been loaded
         * before.
         */
        load() {
            // loading data is forbidden if the component is already loading or loaded
            if ([null, "error"].indexOf(this.state) === -1) {
                return;
            }

            this.state = "loading";
            this.error = null;

            getRecentComments()
                .then(({ comments }) => {
                    this.comments = comments;
                    this.state = "loaded";
                })
                .catch(({ user_message: error }) => {
                    this.error = error;
                    this.state = "error";
                });
        },

        /**
         * Alias to load(), for better readibility in the view
         *
         * @see load()
         */
        retryLoading() {
            this.load();
        },

        /**
         *
         */
        routeToTown(params) {
            const routeData = this.$router.resolve(
                `/site/${params.row.shantytown}`
            );
            open(routeData.href);
        }
    }
};
