import NavBar from '#app/layouts/navbar/navbar.vue';
import { get, addStep } from '#helpers/api/action';
import Datepicker from 'vuejs-datepicker';
import { fr } from 'vuejs-datepicker/dist/locale';

export default {
    components: {
        NavBar,
        Datepicker,
    },
    data() {
        return {
            loading: false,
            error: null,
            action: null,
            dateLanguage: fr,
            formError: null,
            fieldErrors: {},
            newStep: '',
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
    },
};
