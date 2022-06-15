<template>
    <div class="p-4 fixed top-0 min-h-screen w-screen z-1001 bg-white">
        <div class="text-right">
            <Button
                variant="primaryText"
                size="sm"
                icon="times"
                @click="$store.commit('navigation/closeMobileMenu')"
            >
                Fermer
            </Button>
        </div>
        <ul class="mt-4 text-sm">
            <MobileMenuLinkItem
                v-for="item in items"
                :key="item.target"
                :target="item.target"
                :label="item.label"
                :matomo="item.matomo"
                :class="isCurrentPage(item) ? 'font-bold' : ''"
            >
            </MobileMenuLinkItem>
        </ul>
    </div>
</template>

<style scoped>
.z-1001 {
    z-index: 1001;
}
</style>

<script>
import MobileMenuLinkItem from "./MobileMenuLinkItem.vue";

export default {
    components: {
        MobileMenuLinkItem
    },
    props: {
        items: {
            type: Array
        }
    },
    methods: {
        isCurrentPage(item) {
            return this.$router.currentRoute.meta.group === item.id;
        }
    }
};
</script>
