<template>
    <Layout v-bind="$attrs">
        <template v-slot:banner>
            <ContentWrapper
                class="flex justify-center lg:py-3 items-start lg:items-center"
            >
                <LinkBlock
                    to="/communaute"
                    :class="[
                        'w-44 text-center font-bold border-blue600',
                        currentTab === 'communaute'
                            ? 'border-b-4'
                            : 'text-black',
                    ]"
                >
                    Espace d'entraide
                </LinkBlock>
                <LinkBlock
                    to="/annuaire"
                    :class="[
                        'w-44 text-center font-bold border-blue600',
                        currentTab === 'annuaire' ? 'border-b-4' : 'text-black',
                    ]"
                >
                    Annuaire
                </LinkBlock>
            </ContentWrapper>
        </template>

        <slot />
    </Layout>
</template>

<script setup>
import { computed } from "vue";
import router from "@/helpers/router";
import { LinkBlock } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";

const currentTab = computed(() => {
    const { meta } = router.currentRoute.value;
    return meta.communauteTab || null;
});
</script>
