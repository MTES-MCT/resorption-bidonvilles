<template>
    <nav class="mx-auto bg-white my-1">
        <div
            class="px-10 flex lg:justify-items-start justify-between lg:py-6 lg:border-g300 lg:border-b-1"
        >
            <!-- logos -->
            <div class="flex flex-shrink-0 items-center xl:space-x-8">
                <img
                    class="hidden xl:block h-20 mb-4 lg:mb-0"
                    src="./assets/bm_rp.png"
                />
                <router-link to="/">
                    <img
                        class="hidden lg:block h-16"
                        src="./assets/logo-resorption-bidonvilles.png"
                    />
                </router-link>
            </div>
            <div class="hidden lg:flex space-x-4">
                <!-- Navigation items - upper menu items -->
                <div
                    class="flex flex-row items-center"
                    v-for="item in upperMenuItems"
                    :key="item.target"
                >
                    <DesktopMenuLinkItem
                        :target="item.target"
                        :label="item.label"
                        :classes="item.classes"
                    ></DesktopMenuLinkItem>
                </div>
            </div>
            <!-- Mobile button goes here -->
            <div class="lg:hidden flex items-center my-6">
                <button class="mobile-menu-button" @click="openMobileMenu">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-10 w-10"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
        <div class="px-10 hidden lg:flex space-x-4">
            <!-- Navigation items - lower menu items -->
            <div
                class="flex flex-row items-center"
                v-for="item in lowerMenuItems"
                :key="item.target"
            >
                <DesktopMenuLinkItem
                    :target="item.target"
                    :label="item.label"
                    :classes="item.classes"
                ></DesktopMenuLinkItem>
            </div>
        </div>
        <!-- mobile menu side panel -->
        <MobileMenuSidePanel
            :items="items"
            class="lg:hidden"
            :isOpen="mobileMenuOpen"
            :closePanel="() => (mobileMenuOpen = false)"
        />
    </nav>
</template>

<script>
import MobileMenuSidePanel from "./MobileMenuSidePanel.vue";
import DesktopMenuLinkItem from "./DesktopMenuLinkItem.vue";
import { hasPermission } from "#helpers/api/config";
import menuItems from "./menuItems";

export default {
    components: {
        DesktopMenuLinkItem,
        MobileMenuSidePanel
    },
    data() {
        return {
            mobileMenuOpen: false
        };
    },
    computed: {
        items() {
            if (!this.$store.getters["user/loggedIn"]) {
                return menuItems.anonymous;
            }

            if (
                this.$store.getters["config/loaded"] !== true ||
                this.$store.getters["config/hasAcceptedCharte"] !== true
            ) {
                return menuItems.loading;
            }

            return this.filterItems(menuItems.loaded);
        },
        upperMenuItems() {
            return this.filterMenuItems(this.items, "upper");
        },
        lowerMenuItems() {
            return this.filterMenuItems(this.items, "lower");
        }
    },
    methods: {
        filterMenuItems(items, itemType) {
            return items.filter(elt => elt.menu === itemType);
        },
        filterItems(items) {
            return items.filter(item => {
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
        openMobileMenu() {
            this.mobileMenuOpen = true;
        }
    }
};
</script>
