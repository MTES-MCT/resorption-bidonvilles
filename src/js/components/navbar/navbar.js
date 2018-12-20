import { logout, isLoggedIn } from '#src/helpers/userHelper';
import { isLoaded as isConfigLoaded } from '#src/helpers/configHelper';

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
