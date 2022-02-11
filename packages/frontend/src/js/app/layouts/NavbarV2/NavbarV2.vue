<!-- A renommer Navbar, ainsi que le répertoire, une fois toute référence à navbar (v1) supprimées -->
<template>
    <nav class="container px-10 mx-auto bg-white my-4">
        <div ref="menu" class="flex lg:flex-row-reverse justify-between">
            <div class="hidden lg:flex space-x-4">
                <div class="flex flex-row-reverse items-center">
                    <!-- Navigation items - emphased menu items -->
                    <div
                        v-for="item in emphasedMenuItems.reverse().slice()"
                        :key="item.target"
                    >
                        <DesktopMenuLinkItem
                            :target="item.target"
                            :label="item.label"
                            :classes="item.classes"
                            :group="item.group"
                        ></DesktopMenuLinkItem>
                    </div>
                    <span>|</span>
                    <!-- Navigation items - normal menu items -->
                    <div
                        class="flex items-center"
                        v-for="item in primaryMenuItems.reverse().slice()"
                        :key="item.target"
                    >
                        <DesktopMenuLinkItem
                            :target="item.target"
                            :label="item.label"
                            :classes="item.classes"
                            :group="item.group"
                        ></DesktopMenuLinkItem>
                    </div>
                </div>
            </div>
            <!-- logos -->
            <div class="flex flex-shrink-0 items-center lg:space-x-8 xl:ml-8">
                <img
                    class="hidden xl:block h-20 mb-4 lg:mb-0"
                    src="./assets/logo-marianne.png"
                />
                <router-link to="/">
                    <img
                        class="h-16"
                        src="./assets/logo-resorption-bidonvilles.png"
                    />
                </router-link>
            </div>
            <!-- Mobile button goes here -->
            <div class="lg:hidden flex items-center">
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
import { isLoggedIn } from "#helpers/api/user";
import MobileMenuSidePanel from "./MobileMenuSidePanel.vue";
import DesktopMenuLinkItem from "./DesktopMenuLinkItem.vue";
import {
    isLoaded as isConfigLoaded,
    hasPermission,
    hasAcceptedCharte
} from "#helpers/api/config";
import ITEMS from "./menuItems";

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
            if (isLoggedIn() !== true) {
                return ITEMS.anonymous;
            }

            if (isConfigLoaded() !== true || hasAcceptedCharte() !== true) {
                return ITEMS.loading;
            }

            return this.filterItems(ITEMS.loaded);
        },
        primaryMenuItems() {
            return this.filterMenuItems(this.items, "primary");
        },
        emphasedMenuItems() {
            return this.filterMenuItems(this.items, "emphased");
        }
    },
    methods: {
        filterMenuItems(items, itemType) {
            return items.filter(elt => elt.menu === itemType);
        },
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
        openMobileMenu() {
            this.mobileMenuOpen = true;
        }
    }
};
</script>
