import NavBar from '#app/layouts/navbar/navbar.vue';
import { get as getConfig, hasPermission } from '#helpers/api/config';
import {
    get, edit, addStep, destroy,
} from '#helpers/api/action';
import Datepicker from 'vuejs-datepicker';
import { fr } from 'vuejs-datepicker/dist/locale';

export default {
    components: {
        NavBar,
        Datepicker,
    },
    data() {
        return {
            actionTypes: getConfig().action_types,
            loading: false,
            error: null,
            deleteError: null,
            action: null,
            dateLanguage: fr,
            formError: null,
            fieldErrors: {},
            edit: {},
            editError: null,
            editErrors: {},
            newStep: '',
            mode: 'view',
        };
    },
    computed: {
        description() {
            if (this.action === null) {
                return null;
            }

            return this.action.description.replace(/\n/g, '\n\r');
        },
    },
    created() {
        this.fetchData();
    },
    methods: {
        hasPermission,
        fetchData() {
            if (this.loading === true) {
                return;
            }

            this.loading = true;
            this.error = null;

            get(this.$route.params.id)
                .then((action) => {
                    this.loading = false;
                    this.action = action;
                })
                .catch((errors) => {
                    this.error = errors.user_message;
                    this.loading = false;
                });
        },
        setEditMode() {
            this.setMode('edit');
        },
        setViewMode() {
            this.setMode('view');
        },
        setMode(mode) {
            this.resetEdit();
            this.mode = mode;
        },
        resetEdit() {
            this.editError = null;
            this.editErrors = {};
            this.edit = {
                type: this.action.type.id,
                name: this.action.name,
                description: this.action.description,
                started_at: this.action.startedAt * 1000,
                ended_at: this.action.endedAt ? this.action.endedAt * 1000 : null,
            };
        },
        submitEdit() {
            edit(this.$route.params.id, this.edit)
                .then(() => {
                    this.$router.go();
                })
                .catch((error) => {
                    this.editError = error.user_message;
                    this.editErrors = error.fields || {};
                });
        },
        submit() {
            // clean previous errors
            this.formError = null;
            this.fieldErrors = {};

            addStep(this.$route.params.id, {
                description: this.newStep,
            })
                .then((response) => {
                    this.formError = null;
                    this.fieldErrors = {};
                    this.action.steps = response.steps;
                    this.newStep = '';
                })
                .catch((response) => {
                    this.formError = response.user_message;
                    this.fieldErrors = response.fields || {};
                });
        },
        destroy() {
            // eslint-disable-next-line
            const confirmed = confirm('Êtes-vous sûr ? Cette suppression est irréversible');

            if (confirmed === true) {
                destroy(this.$route.params.id)
                    .then(() => {
                        this.$router.push('/liste-des-actions');
                    })
                    .catch((error) => {
                        this.deleteError = error.user_message;
                    });
            }
        },
    },
};
