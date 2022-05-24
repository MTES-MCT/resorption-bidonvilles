<template>
    <header>
        <nav
            class="p-4 flex items-start justify-between border-b-1 lg:px-10 lg:py-6 lg:items-center"
        >
            <div class="flex items-center">
                <img
                    class="h-20"
                    src="./assets/bm_rp.png"
                    alt="République Française"
                />
                <router-link class="ml-6 lg:ml-12" to="/">
                    <img
                        alt="Résorption-bidonvilles"
                        class="h-12 lg:h-16"
                        src="./assets/logo-resorption-bidonvilles.png"
                    />
                </router-link>
            </div>
            <ul class="hidden lg:flex items-center space-x-6">
                <li
                    v-for="(item, index) in upperMenuItems"
                    :key="item.target || `separator${index}`"
                >
                    <span
                        v-if="item.type === 'separator'"
                        class="w-px bg-G400 h-4 block"
                    ></span>
                    <Link
                        v-else
                        :to="item.target"
                        @click.native="handleTracking(item.matomo)"
                    >
                        {{ item.label }}
                    </Link>
                </li>
            </ul>
            <button
                class="lg:hidden -mt-2 text-xl"
                @click="$store.commit('navigation/openMobileMenu')"
            >
                <Icon icon="bars" />
            </button>
        </nav>

        <nav class="hidden lg:block">
            <ul class="px-6 flex xl:space-x-6 border-b-1">
                <li v-for="item in lowerMenuItems" :key="item.target">
                    <Link
                        :to="item.target"
                        :color="getColor(item)"
                        :hoverColor="item.color || 'G800'"
                        :class="getClass(item)"
                    >
                        {{ item.label }}
                    </Link>
                </li>
            </ul>
        </nav>

        <!--side panel-->
        <MobileMenuSidePanel
            class="lg:hidden"
            v-show="$store.state.navigation.mobileMenuIsOpen"
            :items="items"
        />
    </header>
</template>

<script>
import MobileMenuSidePanel from "./MobileMenuSidePanel.vue";
import menuItems from "./menuItems";

export default {
    components: {
        MobileMenuSidePanel
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
            const items = this.filterMenuItems(this.items, "upper");

            return [
                ...items
                    .slice(0, items.length - 1)
                    .map(item => [item, { type: "separator" }])
                    .flat(),
                items[items.length - 1]
            ];
        },
        lowerMenuItems() {
            return this.filterMenuItems(this.items, "lower");
        }
    },
    methods: {
        handleTracking(tracking) {
            if (!tracking) {
                return;
            }

            this.$trackMatomoEvent(tracking.category, tracking.action);
        },
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
                this.$store.getters["config/hasPermission"](permission)
            );
        },
        isCurrentPage(item) {
            console.log(`item.links: ${JSON.stringify(item.links)}`);
            return (
                // this.$router.currentRoute.path === target ||
                item.links.includes(
                    `/${this.$router.currentRoute.path.split("/")[1]}`
                ) ||
                (this.$router.currentRoute.path === "/tableau-de-bord" &&
                    item.target === "/")
            );
        },
        getColor(item) {
            return this.isCurrentPage(item)
                ? item.color || "text-primary"
                : item.color || "text-G800";
        },
        getClass(item) {
            return this.isCurrentPage(item)
                ? `link actif ${item.classes || ""}`
                : `link inactif ${item.classes || ""}`;
            /*
                ? `inline-block py-4 px-3 xl:px-4 border-t-2 border-b-2 border-primary hover:bg-G200 ${item.classes ||
                    ""}`
                : `inline-block py-4 px-3 xl:px-4 border-t-2 border-b-2 border-transparent hover:bg-G200 ${item.classes ||
                    ""}`;
            */
        }
    }
};
</script>
<style scoped>
.link {
    display: inline-block;
    padding-top: 1rem; /* 16px */
    padding-bottom: 1rem; /* 16px */
    padding-left: 0.75rem; /* 12px */
    padding-right: 0.75rem; /* 12px */
    border-top-width: 2px;
    border-bottom-width: 2px;
    text-decoration: none;
}

.actif {
    border-bottom-color: #000091;
    border-top-color: transparent;
}

.inactif {
    border-color: transparent;
}

.actif:hover {
    background-color: #f0f0f0;
}

.inactif:hover {
    background-color: #f0f0f0;
}
</style>
