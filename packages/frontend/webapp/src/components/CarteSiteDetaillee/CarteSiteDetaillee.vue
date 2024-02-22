<template>
    <div
        :class="[
            'rounded-sm cursor-pointer border-1 border-cardBorder preventPrintBreak print:h-[17.3rem]',
            isHover ? 'bg-blue200 border-transparent' : '',
            !isOpen ? 'closedShantytown' : '',
        ]"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
    >
        <RouterLink
            :to="`/site/${shantytown.id}`"
            :class="focusClasses.outline"
        >
            <div
                class="-mt-1 print:mt-0"
                :aria-label="`Fiche site ${shantytown.addressSimple} ${
                    shantytown.name ? shantytown.name : ''
                } ${shantytown.city.name}`"
            >
                <CarteSiteDetailleeHeader
                    class="mb-4"
                    :shantytown="shantytown"
                    :isHover="isHover"
                />
                <CarteSiteDetailleeName :shantytown="shantytown" />

                <div
                    class="flex flex-col space-y-5 lg:flex-none lg:grid cardGridTemplateColumns print:grid lg:gap-10 px-6 py-4"
                >
                    <CarteSiteDetailleeFieldType :shantytown="shantytown" />
                    <CarteSiteDetailleeOrigins :shantytown="shantytown" />
                    <CarteSiteDetailleeLivingConditions
                        v-if="isOpen"
                        :shantytown="shantytown"
                    />
                    <CarteSiteDetailleeClosingSolutions
                        v-else
                        :shantytown="shantytown"
                    />
                    <CarteSiteDetailleeJustice
                        v-if="userStore.hasJusticePermission"
                        :shantytown="shantytown"
                    />
                    <CarteSiteDetailleeActors :shantytown="shantytown" />
                </div>

                <CarteSiteDetailleeFooter
                    :shantytown="shantytown"
                    :isHover="isHover"
                />
            </div>
        </RouterLink>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed, ref } from "vue";
import { useUserStore } from "@/stores/user.store";
import focusClasses from "@common/utils/focus_classes";

import CarteSiteDetailleeHeader from "./CarteSiteDetailleeHeader.vue";
import CarteSiteDetailleeName from "./CarteSiteDetailleeName.vue";
import CarteSiteDetailleeFieldType from "./CarteSiteDetailleeFieldType.vue";
import CarteSiteDetailleeOrigins from "./CarteSiteDetailleeOrigins.vue";
import CarteSiteDetailleeLivingConditions from "./CarteSiteDetailleeLivingConditions.vue";
import CarteSiteDetailleeClosingSolutions from "./CarteSiteDetailleeClosingSolutions.vue";
import CarteSiteDetailleeJustice from "./CarteSiteDetailleeJustice.vue";
import CarteSiteDetailleeActors from "./CarteSiteDetailleeActors.vue";
import CarteSiteDetailleeFooter from "./CarteSiteDetailleeFooter.vue";

const props = defineProps({
    shantytown: {
        type: Object,
    },
});
const userStore = useUserStore();
const { shantytown } = toRefs(props);
const isHover = ref(false);
const isOpen = computed(() => {
    return shantytown.value.status === "open";
});
</script>

<style scoped lang="scss">
.cardGridTemplateColumns {
    grid-template-columns: 160px 208px 170px auto 200px;

    @media print {
        grid-template-columns: 160px 208px 164px 200px 236px;
    }
}

.closedShantytown {
    .cardGridTemplateColumns {
        @media print {
            grid-template-columns: 140px 91px 150px 154px 0px;
        }
    }
}

.closedShantytown {
    position: relative;
    overflow: hidden;
}

@media not print {
    .closedShantytown:before {
        position: absolute;
        pointer-events: none;
        content: "";
        background: linear-gradient(
            to left bottom,
            transparent 50%,
            currentColor 49.8%,
            currentColor 50.2%,
            transparent 50%
        );
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
}

.preventPrintBreak {
    @media print {
        // firefox
        break-inside: avoid;
        // webkit (chrome/brave/edge)
        page-break-inside: avoid;
    }
}
</style>
