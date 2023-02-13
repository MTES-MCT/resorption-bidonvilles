<template>
    <Layout v-bind="$attrs">
        <template v-slot:banner>
            <ContentWrapper
                class="flex justify-center lg:py-3 items-start lg:items-center"
            >
                <div
                    @click="changeTab('communaute')"
                    :class="[
                        'w-44 text-center p-4 font-bold cursor-pointer',
                        questionsStore.tab === 'communaute'
                            ? 'text-primary border-b-4 border-blue600'
                            : '',
                    ]"
                >
                    Espace d'entraide
                </div>
                <div
                    @click="changeTab('directory')"
                    :class="[
                        'w-44 text-center p-4 font-bold cursor-pointer',
                        questionsStore.tab === 'directory'
                            ? 'text-primary border-b-4 border-blue600'
                            : '',
                    ]"
                >
                    Annuaire
                </div>
            </ContentWrapper>
        </template>
        <slot />
    </Layout>
</template>

<script setup>
import { useQuestionsStore } from "@/stores/questions.store";

import Layout from "@/components/Layout/Layout.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";

const questionsStore = useQuestionsStore();

function changeTab(value) {
    questionsStore.tab = value;
}
</script>
