import { logout, isLoggedIn } from '#helpers/api/user';
import { isLoaded as isConfigLoaded } from '#helpers/api/config';

export default {
    data() {
        return {
            loggedIn: isLoggedIn(),
            configLoaded: isConfigLoaded(),
        };
    },
    methods: {
        logout() {
            logout();
            this.$router.push('/');
        },
    },
};
