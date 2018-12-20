import { logout, isLoggedIn } from '#helpers/userHelper';
import { isLoaded as isConfigLoaded } from '#helpers/configHelper';

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
