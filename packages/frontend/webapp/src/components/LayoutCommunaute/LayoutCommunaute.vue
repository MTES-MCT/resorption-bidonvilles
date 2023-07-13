<template>
    <Layout v-bind="$attrs">
        <template v-slot:banner>
            <ContentWrapper
                class="flex justify-center items-start lg:items-center text-xl"
            >
                <LinkBlock
                    icon="comments"
                    to="/communaute"
                    :class="[
                        'w-72 text-center font-bold border-t-transparent border-y-4',
                        currentTab === 'communaute'
                            ? 'border-b-blue600'
                            : 'border-b-transparent text-black',
                    ]"
                >
                    Espace d'entraide
                </LinkBlock>
                <LinkBlock
                    icon="users"
                    to="/annuaire"
                    :class="[
                        'w-72 text-center font-bold border-t-transparent border-y-4',
                        currentTab === 'annuaire'
                            ? 'border-b-blue600'
                            : 'border-b-transparent text-black',
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
import { ContentWrapper, LinkBlock } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";

const currentTab = computed(() => {
    const { meta } = router.currentRoute.value;
    return meta.communauteTab || null;
});
</script>
