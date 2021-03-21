import { isLoggedIn } from "#helpers/api/user";
import {
    isLoaded as isConfigLoaded,
    hasPermission,
    hasAcceptedCharte
} from "#helpers/api/config";
import ITEMS from "./items";

export default {
    data() {
        return {
            isSidebarOpened: false
        };
    },
    computed: {
        items() {
            if (isLoggedIn() !== true) {
                return ITEMS.anonymous;
            }

            if (isConfigLoaded() !== true || hasAcceptedCharte() !== true) {
                return ITEMS.loading;
            }

            return this.filterItems(ITEMS.loaded);
        }
    },
    methods: {
        filterItems(items) {
            return items
                .map(item => {
                    if (item.items) {
                        return Object.assign(item, {
                            items: item.items.filter(subitem =>
                                this.isItemAllowed(subitem)
                            )
                        });
                    }

                    return item;
                })
                .filter(item => {
                    if (item.items) {
                        return item.items.length > 0;
                    }

                    return this.isItemAllowed(item);
                });
        },
        isItemAllowed(item) {
            const requiredPermissions = this.$router.resolve({
                path: item.target
            }).route.meta.permissions;

            if (!requiredPermissions) {
                return true;
            }

            return requiredPermissions.every(permission =>
                hasPermission(permission)
            );
        },
        isCurrentRouteAMemberOf(group) {
            return this.$route.matched.some(
                route => route.meta.group === group
            );
        },
        showSidebar() {
            this.isSidebarOpened = true;
        },
        hideSidebar() {
            this.isSidebarOpened = false;
        },
        checkClickOutsideSidebar(event) {
            // in case of a click outside the sidebar and NOT on the "Menu" link
            if (
                !this.$refs.sidebar.contains(event.target) &&
                event.target !== this.$refs.menu
            ) {
                this.hideSidebar();
            }
        }
    },
    mounted() {
        document.addEventListener("click", this.checkClickOutsideSidebar);
    },
    destroyed() {
        document.removeEventListener("click", this.checkClickOutsideSidebar);
    }
};
