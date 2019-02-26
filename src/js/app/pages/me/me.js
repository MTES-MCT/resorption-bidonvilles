import NavBar from '#app/layouts/navbar/navbar.vue';
import { me, edit } from '#helpers/api/user';

export default {
    components: {
        NavBar,
    },
    data() {
        return {
            preloading: true,
            preloadError: null,
            loading: false,
            firstName: '',
            lastName: '',
            company: '',
            password: '',
            errors: undefined,
            fieldErrors: {},
        };
    },
    created() {
        this.preload();
    },
    methods: {
        preload() {
            this.preloadError = null;
            this.preloading = true;
            this.fetchData()
                .then(() => {
                    this.preloading = false;
                })
                .catch((error) => {
                    this.preloadError = error.user_message;
                });
        },
        fetchData() {
            return me()
                .then((data) => {
                    this.firstName = data.first_name;
                    this.lastName = data.last_name;
                    this.company = data.company;
                    this.password = '';
                });
        },
        submit() {
            this.errors = undefined;
            this.fieldErrors = {};
            this.loading = true;

            edit({
                first_name: this.firstName,
                last_name: this.lastName,
                company: this.company,
                password: this.password !== '' ? this.password : null,
            })
                .then(() => {
                    this.errors = undefined;
                    this.loading = false;

                    this.$notify({
                        group: 'notifications',
                        type: 'success',
                        title: 'Informations modifiées',
                        text: 'Vos informations ont correctement été modifiées',
                    });

                    return this.preload();
                })
                .catch((error) => {
                    this.errors = error;
                    this.fieldErrors = error.fields || {};
                    this.loading = false;
                });
        },
    },
};
