import NavBar from '../navbar/navbar.vue';
import { login } from '../../helpers/userHelper';

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
            login(this.email, this.password)
                .then(() => {
                    this.$router.push({ path: '/liste-des-sites' });
                })
                .catch((response) => {
                    if (response) {
                        this.errors = response;
                        return;
                    }

                    this.errors = {
                        user_message: 'Identification échouée',
                    };
                });
        },
    },
};
