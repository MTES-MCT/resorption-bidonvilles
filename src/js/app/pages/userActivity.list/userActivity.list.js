import { list } from '#helpers/api/userActivity';
import NavBar from '#app/layouts/navbar/navbar.vue';
import Table from '#app/components/table/table.vue';
import CommentDeletion from '#app/components/comment-deletion/comment-deletion.vue';
import SlideNote from '#app/components/slide-note/slide-note.vue';
import { notify } from '#helpers/notificationHelper';

export default {
    components: {
        NavBar,
        Table,
        CommentDeletion,
        SlideNote,
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
            toBeDeleted: null,

            /**
             *
             */
            filter: 'all',
        };
    },

    computed: {
        columns() {
            return [
                { id: 'date', label: 'Date' },
                { id: 'author', label: 'Auteur' },
                Object.assign(
                    { id: 'activity', label: 'Activités' },
                    this.filter === 'shantytown'
                        ? {
                            filters: [
                                { label: 'Déclaration', value: 'creation' },
                                { label: 'Modification', value: 'update' },
                                { label: 'Fermeture', value: 'closing' },
                            ],
                            filterFn: (row, checkedItems) => checkedItems.map(({ value }) => value)
                                .indexOf(row.rawAction) !== -1,
                        }
                        : {},
                ),
            ];
        },
        filteredActivities() {
            if (this.filter === 'all') {
                return this.activities;
            }

            return this.activities.filter(({ entity }) => entity === this.filter);
        },
        parsedActivities() {
            return this.filteredActivities.map((activity, index) => {
                const obj = {
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
                };

                const shantytownActions = {
                    creation: 'Déclaration du',
                    update: 'Modification du',
                    closing: 'Fermeture du',
                };

                if (activity.entity === 'comment') {
                    obj.action = 'Commentaire sur le';
                    obj.content = activity.content;
                    obj.comment = activity.comment_id;
                } else {
                    obj.action = shantytownActions[activity.action];
                    obj.diff = activity.diff;
                }

                return obj;
            });
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

            list()
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

        /**
         *
         */
        confirmCommentDeletion(row, event) {
            this.toBeDeleted = {
                index: row.index,
                id: row.comment,
                shantytown: row.rawShantytown,
                author: row.author,
                date: row.rawDate,
                content: row.content,
            };
            event.stopPropagation();
            return false;
        },

        /**
         *
         */
        closePopin() {
            this.toBeDeleted = null;
        },

        /**
         *
         */
        onCommentDeleted() {
            this.activities.splice(this.toBeDeleted.index, 1);
            this.toBeDeleted = null;

            notify({
                group: 'notifications',
                type: 'success',
                title: 'Commentaire supprimé',
                text: 'L\'auteur du commentaire en a été notifié par email',
            });
        },

        show(filter) {
            this.filter = filter;
        },
    },
};
