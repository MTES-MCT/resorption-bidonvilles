import NavBar from '#app/layouts/navbar/navbar.vue';
import { signup } from '#helpers/api/user';

export default {
    components: {
        NavBar,
    },
    data() {
        return {
            loading: false,
            email: '',
            description: '',
            success: false,
            errors: undefined,
        };
    },
    methods: {
        submit() {
            // avoid submitting a request twice at the same time
            if (this.loading === true) {
                return;
            }

            // request signup
            this.loading = true;

            signup(this.email, this.description)
                .then(() => {
                    this.loading = false;
                    this.success = true;
                    this.errors = undefined;
                    this.email = '';
                    this.description = '';
                })
                .catch((errors) => {
                    this.loading = false;
                    this.success = false;
                    this.errors = errors;
                });
        },
    },
};
