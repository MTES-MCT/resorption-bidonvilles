<template>
    <div
        :class="[
            'rounded-sm cursor-pointer border-1 border-cardBorder',
            isHover ? 'bg-blue200 border-transparent' : '',
        ]"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
    >
        <RouterLink :to="`/action/${plan.id}`">
            <div class="-mt-1">
                <div class="mb-4 px-6">
                    <Tag
                        :class="[
                            'text-xs uppercase text-primary',
                            isHover ? 'shadow-md' : '',
                        ]"
                    >
                        <span v-if="plan.expected_to_end_at"
                            >du {{ formatDate(plan.started_at) }} au
                            {{ formatDate(plan.expected_to_end_at) }}</span
                        >
                        <span v-else>
                            depuis le {{ formatDate(plan.started_at) }}
                        </span>
                    </Tag>
                </div>

                <div class="text-md px-6">
                    <div class="text-display-md">
                        <span class="font-bold">
                            {{ plan.name }}
                        </span>
                    </div>
                </div>

                <div class="md:grid cardGridTemplateColumns gap-10 px-6 py-4">
                    <!-- 1ère colonne -->
                    <CarteActionColonneChampsIntervention
                        :topics="plan.topics"
                    />

                    <!-- 2ème colonne -->
                    <CarteActionDetailleeColonneDepartement
                        :departement="plan.departement"
                    />

                    <!-- 3ème colonne -->
                    <CarteActionDetailleeColonneLocalisation :plan="plan" />

                    <!-- 4ème colonne -->
                    <CarteActionDetailleeColonnePilote
                        :government_contact="plan.government_contacts[0]"
                    />

                    <!-- 5ème colonne -->
                    <CarteActionDetailleeColonneOperateur
                        :operator_contact="plan.operator_contacts[0]"
                    />

                    <!-- fin des colonnes -->
                </div>

                <div class="flex justify-end px-4 pt-4">
                    <div>
                        <Button
                            variant="text"
                            icon="arrow-right"
                            class="text-primary text-display-sm hover:underline -mb-1"
                        >
                            Voir la fiche de l'action
                        </Button>
                    </div>
                </div>
            </div>
        </RouterLink>
    </div>
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";

import { RouterLink } from "vue-router";
import { Tag, Button } from "@resorptionbidonvilles/ui";
import CarteActionColonneChampsIntervention from "./CarteActionColonneChampsIntervention.vue";
import CarteActionDetailleeColonneDepartement from "./CarteActionDetailleeColonneDepartement.vue";
import CarteActionDetailleeColonneLocalisation from "./CarteActionDetailleeColonneLocalisation.vue";
import CarteActionDetailleeColonnePilote from "./CarteActionDetailleeColonnePilote.vue";
import CarteActionDetailleeColonneOperateur from "./CarteActionDetailleeColonneOperateur.vue";

const props = defineProps({
    plan: {
        type: Object,
    },
});

const { plan } = toRefs(props);

const isHover = ref(false);

function formatDate(value) {
    const date = new Date();
    date.setTime(value);
    return date.toLocaleDateString();
}
</script>

<style scoped lang="scss">
.cardGridTemplateColumns {
    grid-template-columns: 222px 208px 164px 200px auto;
}
</style>
