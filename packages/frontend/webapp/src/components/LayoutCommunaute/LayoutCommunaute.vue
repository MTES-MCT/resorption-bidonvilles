<template>
    <Layout v-bind="$attrs" :paddingTop="false">
        <template v-slot:banner>
            <ContentWrapper
                class="flex justify-center lg:py-3 items-start lg:items-center"
            >
                <LinkButton
                    to="/communaute"
                    :class="[
                        'w-44 text-center font-bold border-blue600',
                        currentTab === 'communaute' ? 'border-b-4' : '',
                    ]"
                >
                    Espace d'entraide
                </LinkButton>
                <LinkButton
                    to="/annuaire"
                    :class="[
                        'w-44 text-center font-bold border-blue600',
                        currentTab === 'directory' ? 'border-b-4' : '',
                    ]"
                >
                    Annuaire
                </LinkButton>
            </ContentWrapper>
        </template>

        <slot />
    </Layout>
</template>

<script setup>
import { computed } from "vue";
import router from "@/helpers/router";
import { LinkButton } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";

const currentTab = computed(() => {
    const { path } = router.currentRoute.value;
    if (path.startsWith("/annuaire")) {
        return "directory";
    }
    if (path.startsWith("/communaute")) {
        return "communaute";
    }

    return null;
});
</script>
