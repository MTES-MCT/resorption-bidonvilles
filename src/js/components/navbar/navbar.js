import { logout, isLoggedIn } from '#src/helpers/userHelper';

export default {
    data() {
        return {
            loggedIn: isLoggedIn(),
        };
    },
    methods: {
        logout() {
            logout();
            this.$router.push('/');
        },
    },
};
