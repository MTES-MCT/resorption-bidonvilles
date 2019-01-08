import { logout, isLoggedIn } from '#helpers/api/user';
import { isLoaded as isConfigLoaded } from '#helpers/api/config';

export default {
    data() {
        return {
            loggedIn: isLoggedIn(),
            configLoaded: isConfigLoaded(),
        };
    },
    computed: {
        isInTownList() {
            return this.$route.matched.some(route => route.meta.group === 'townList');
        },
        isInTownCreation() {
            return this.$route.matched.some(route => route.meta.group === 'townCreation');
        },
        isInActionList() {
            return this.$route.matched.some(route => route.meta.group === 'actionList');
        },
        isInActionCreation() {
            return this.$route.matched.some(route => route.meta.group === 'actionCreation');
        },
    },
    methods: {
        logout() {
            logout();
            this.$router.push('/');
        },
    },
};
