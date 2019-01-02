import NavBar from '#app/layouts/navbar/navbar.vue';
import { login } from '#helpers/api/user';

export default {
    components: {
        NavBar,
    },
    data() {
        return {
            loading: false,
            email: '',
            password: '',
            errors: undefined,
        };
    },
    methods: {
        submit() {
            // avoid submitting a request twice at the same time
            if (this.loading === true) {
                return;
            }

            // request signin
            this.loading = true;

            login(this.email, this.password)
                .then(() => {
                    this.loading = false;
                    this.email = '';
                    this.password = '';
                    this.errors = undefined;

                    this.$router.push({ path: '/' });
                })
                .catch((errors) => {
                    this.loading = false;
                    this.errors = errors;
                });
        },
    },
};
