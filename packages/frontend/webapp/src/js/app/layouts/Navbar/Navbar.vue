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
            return this.$router.currentRoute.meta.group === item.id;
        },
        getColor(item) {
            return (
                item.color ||
                (this.isCurrentPage(item) ? "text-primary" : "text-G800")
            );
        },
        getClass(item) {
            let classes =
                "relative inline-block py-4 px-3 xl:px-4 hover:bg-G200";
            if (item.classes) {
                classes += " " + item.classes;
            }

            if (this.isCurrentPage(item)) {
                classes += " active";
            }

            return classes;
        }
    }
};
</script>

<style scoped>
.covid {
    @apply font-bold uppercase;
}

.active::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    height: 0.1rem;
    width: 100%;
    @apply bg-primary;
}

.covid.active::before {
    @apply bg-red600;
}
</style>
