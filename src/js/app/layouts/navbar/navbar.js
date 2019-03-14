import { isLoggedIn } from '#helpers/api/user';
import { isLoaded as isConfigLoaded, get } from '#helpers/api/config';
import ITEMS from './items';

export default {
    data() {
        return {
            isSidebarOpened: false,
        };
    },
    computed: {
        items() {
            if (isLoggedIn() !== true) {
                return ITEMS.anonymous;
            }

            if (isConfigLoaded() !== true) {
                return ITEMS.loading;
            }

            return this.filterItems(ITEMS.loaded);
        },
    },
    methods: {
        filterItems(items) {
            const permissions = get().user.permissions.map(permission => permission.name);

            return items.filter((item) => {
                const requiredPermissions = this.$router.resolve({
                    path: item.target,
                }).route.meta.permissions;

                if (!requiredPermissions) {
                    return true;
                }

                return requiredPermissions.every(permission => permissions.includes(permission));
            });
        },
        isCurrentRouteAMemberOf(group) {
            return this.$route.matched.some(route => route.meta.group === group);
        },
        showSidebar() {
            this.isSidebarOpened = true;
        },
        hideSidebar() {
            this.isSidebarOpened = false;
        },
        checkClickOutsideSidebar(event) {
            // in case of a click outside the sidebar and NOT on the "Menu" link
            if (!this.$refs.sidebar.contains(event.target) && event.target !== this.$refs.menu) {
                this.hideSidebar();
            }
        },
    },
    mounted() {
        document.addEventListener('click', this.checkClickOutsideSidebar);
    },
    destroyed() {
        document.removeEventListener('click', this.checkClickOutsideSidebar);
    },
};
