import NavBar from '../navbar/index.vue';

export default {
    components: {
        NavBar,
    },
    data() {
        return {
            email: '',
            password: '',
            errors: undefined,
        };
    },
    methods: {
        submit() {
            if (this.email !== 'anis@beta.gouv.fr' || this.password !== 'test') {
                this.errors = {
                    user_message: 'Identifiants incorrects.',
                };
            } else {
                this.$router.push({ path: '/liste-des-sites ' });
            }
        },
    },
};
