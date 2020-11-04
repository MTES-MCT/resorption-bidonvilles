import { get as getConfig, getPermission } from "#helpers/api/config";
import {
    getDepartementsForRegion,
    getDepartementsForEpci
} from "#helpers/api/geo";
import { create } from "#helpers/api/highCovidComment";
import { list } from "#helpers/api/userActivity";
import NavBar from "#app/layouts/navbar/navbar.vue";
import Table from "#app/components/table/table.vue";
import SlideNote from "#app/components/slide-note/slide-note.vue";

export default {
    components: {
        NavBar,
        Table,
        SlideNote
    },

    data() {
        const { user } = getConfig();

        return {
            /**
             * Current user
             *
             * @type {User}
             */
            user,

            /**
             * Current filter
             *
             * @type {'all'|'regular'|'high'}
             */
            filter: "all",

            /**
             * List of activities
             *
             * @type {Array.<UserActivity>}
             */
            activities: [],

            /**
             * List of departements
             *
             * @type {Array.<Departement>}
             */
            allowedDepartements: [],

            /**
             * List of selected departements
             *
             * @type {Object}
             */
            highCovidComment: {
                pending: false,
                error: null,
                data: {
                    description: "",
                    departements: []
                }
            },

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
            state: null,

            /**
             *
             */
            covidTags: [
                {
                    prop: "equipe_maraude",
                    label: "Équipe de maraude",
                    type: "warning"
                },
                {
                    prop: "equipe_sanitaire",
                    label: "Équipe sanitaire",
                    type: "warning"
                },
                {
                    prop: "equipe_accompagnement",
                    label: "Équipe d'accompagnement",
                    type: "warning"
                },
                {
                    prop: "distribution_alimentaire",
                    label: "Distribution d'aide alimentaire",
                    type: "warning"
                },
                {
                    prop: "personnes_orientees",
                    label:
                        "Personne(s) orientée(s) vers un centre d'hébergement spécialisé (desserrement)",
                    type: "error"
                },
                {
                    prop: "personnes_avec_symptomes",
                    label: "Personne(s) avec des symptômes Covid-19",
                    type: "error"
                },
                {
                    prop: "besoin_action",
                    label: "Besoin d'une action prioritaire",
                    type: "error"
                }
            ]
        };
    },

    computed: {
        columns() {
            return [
                { id: "date", label: "Date" },
                { id: "author", label: "Auteur" },
                { id: "activity", label: "Activités" }
            ];
        },
        filteredActivities() {
            if (this.filter === "all") {
                return this.activities;
            }

            return this.activities.filter(activity => {
                if (this.filter === "regular") {
                    return activity.covid !== null;
                }

                return activity.highCovid !== null;
            });
        },
        parsedActivities() {
            return this.filteredActivities.map((activity, index) => ({
                index,
                rawAction: activity.action,
                rawDate: activity.date,
                rawShantytown: activity.shantytown,
                date: App.formatDate(activity.date, "d/m/y"),
                time: App.formatDate(activity.date, "h:i"),
                author: activity.author,
                icon: activity.entity === "comment" ? "comment" : "pencil-alt",
                shantytown: activity.shantytown.id,
                address: `${activity.shantytown.usename}, ${activity.shantytown.city}`,
                action: "Commentaire sur le",
                content: activity.content,
                comment: activity.comment_id,
                covid: activity.covid,
                highCovid: activity.highCovid
            }));
        },
        canSubmitHighComment() {
            return (
                this.user.organization.location.type !== "nation" &&
                getPermission("covid_comment.list").geographic_level !==
                    "nation"
            );
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

            //
            let departementsPromise;
            switch (this.user.organization.location.type) {
                default:
                case "nation":
                    departementsPromise = Promise.resolve({
                        departements: []
                    });
                    break;

                case "region":
                    departementsPromise = getDepartementsForRegion(
                        this.user.organization.location.region.code
                    );
                    break;

                case "epci":
                    departementsPromise = getDepartementsForEpci(
                        this.user.organization.location.epci.code
                    );
                    break;

                case "departement":
                case "city":
                    departementsPromise = Promise.resolve({
                        departements: [
                            this.user.organization.location.departement
                        ]
                    });
            }

            Promise.all([list({ covid: "1" }), departementsPromise])
                .then(([userActivities, { departements }]) => {
                    this.activities = userActivities;
                    this.allowedDepartements = departements;
                    this.highCovidComment.data.departements = departements.map(
                        ({ code }) => code
                    );
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
         * @see index.js
         */
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        },

        /**
         *
         */
        onRowClick(row) {
            if (!row.shantytown) {
                return;
            }

            this.$router.push(`/site/${row.shantytown}`);
        },

        /**
         * Sets filter
         *
         * @param {'all'|'regular'|'high'} filter
         */
        setFilter(filter) {
            this.filter = filter;
        },

        /**
         *
         */
        submitHighCovidComment() {
            if (this.highCovidComment.pending) {
                return;
            }

            this.highCovidComment.pending = true;
            this.highCovidComment.error = null;

            create(this.highCovidComment.data)
                .then(() => {
                    this.highCovidComment.pending = false;
                    this.state = null;
                    this.load();
                })
                .catch(({ user_message: message, fields }) => {
                    this.highCovidComment.pending = false;
                    this.highCovidComment.error = {
                        message,
                        fields
                    };
                });
        }
    }
};
