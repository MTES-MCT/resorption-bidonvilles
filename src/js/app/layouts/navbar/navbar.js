import { logout, isLoggedIn } from '#helpers/api/user';
import { isLoaded as isConfigLoaded } from '#helpers/api/config';

export default {
    data() {
        return {
            isAsideMenuEnabled: false,
            loggedIn: isLoggedIn(),
            configLoaded: isConfigLoaded(),
        };
    },
    mounted() {
        document.addEventListener('click', this.checkOutsideClick);
    },
    destroyed() {
        document.removeEventListener('click', this.checkOutsideClick);
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
        enableAsideMenu() {
            this.isAsideMenuEnabled = true;
        },
        disableAsideMenu() {
            this.isAsideMenuEnabled = false;
        },
        checkOutsideClick(event) {
            if (!this.$el.contains(event.target)) {
                this.isAsideMenuEnabled = false;
            }
        },
        logout() {
            logout();
            this.$router.push('/');
        },
    },
};
