import { list } from '#helpers/api/userActivity';
import NavBar from '#app/layouts/navbar/navbar.vue';
import Table from '#app/components/table/table.vue';

export default {
    components: {
        NavBar,
        Table,
    },

    data() {
        return {
            /**
             * List of activities
             *
             * @type {Array.<UserActivity>}
             */
            activities: [],

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
                { prop: 'equipe_maraude', label: 'Équipe de maraude', type: 'warning' },
                { prop: 'equipe_sanitaire', label: 'Équipe sanitaire', type: 'warning' },
                { prop: 'equipe_accompagnement', label: 'Équipe d\'accompagnement', type: 'warning' },
                { prop: 'distribution_alimentaire', label: 'Distribution d\'aide alimentaire', type: 'warning' },
                { prop: 'personnes_orientees', label: 'Personne(s) orientée(s) vers un centre d\'hébergement spécialisé (desserrement)', type: 'error' },
                { prop: 'personnes_avec_symptomes', label: 'Personne(s) avec des symptômes Covid-19', type: 'error' },
                { prop: 'besoin_action', label: 'Besoin d\'une action prioritaire', type: 'error' },
            ],
        };
    },

    computed: {
        columns() {
            return [
                { id: 'date', label: 'Date' },
                { id: 'author', label: 'Auteur' },
                { id: 'activity', label: 'Activités' },
            ];
        },
        filteredActivities() {
            return this.activities;
        },
        parsedActivities() {
            return this.filteredActivities.map((activity, index) => ({
                index,
                rawAction: activity.action,
                rawDate: activity.date,
                rawShantytown: activity.shantytown,
                date: App.formatDate(activity.date, 'd/m/y'),
                time: App.formatDate(activity.date, 'h:i'),
                author: activity.author,
                icon: activity.entity === 'comment' ? 'comment' : 'pencil-alt',
                shantytown: activity.shantytown.id,
                address: `${activity.shantytown.name || 'Pas d\'adresse précise'}, ${activity.shantytown.city}`,
                action: 'Commentaire sur le',
                content: activity.content,
                comment: activity.comment_id,
                covid: activity.covid,
            }));
        },
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
            if ([null, 'error'].indexOf(this.state) === -1) {
                return;
            }

            this.state = 'loading';
            this.error = null;

            list({ covid: '1' })
                .then((userActivities) => {
                    this.activities = userActivities;
                    this.state = 'loaded';
                })
                .catch(({ user_message: error }) => {
                    this.error = error;
                    this.state = 'error';
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
            this.$router.push(`/site/${row.shantytown}`);
        },
    },
};
