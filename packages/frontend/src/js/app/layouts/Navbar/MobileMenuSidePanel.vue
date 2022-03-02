<template>
    <SidePanel
        :isOpen="isOpen"
        :closePanel="closePanel"
        :closeClickOutside="true"
    >
        <div class="px-4 pt-8 mx-16">
            <div class="py-4">
                <div class="flex justify-end">
                    <Button
                        variant="primaryText"
                        icon="times"
                        size="lg"
                        @click="closePanel"
                    >
                        Fermer
                    </Button>
                </div>
            </div>
            <ul>
                <li v-for="item in items" :key="item.target">
                    <MobileMenuLinkItem
                        :target="item.target"
                        :label="item.label"
                        v-bind:class="
                            Object.assign(
                                item.group
                                    ? {
                                          active: isCurrentRouteAMemberOf(
                                              item.group
                                          )
                                      }
                                    : {}
                            )
                        "
                    >
                    </MobileMenuLinkItem>
                </li>
            </ul>
        </div>
    </SidePanel>
</template>
<script>
import MobileMenuLinkItem from "./MobileMenuLinkItem.vue";
export default {
    components: {
        MobileMenuLinkItem
    },
    props: {
        items: {
            type: Array
        },
        isOpen: {
            type: Boolean
        },
        closePanel: {
            type: Function
        }
    },
    methods: {
        isCurrentRouteAMemberOf(group) {
            return this.$route.matched.some(
                route => route.meta.group === group
            );
        }
    }
};
</script>
