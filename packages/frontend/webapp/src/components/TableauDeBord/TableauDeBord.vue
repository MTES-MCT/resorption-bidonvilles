<template>
    <ContentWrapper>
        <TableauDeBordGrille :cards="cards" />
    </ContentWrapper>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ContentWrapper } from "@resorptionbidonvilles/ui";
import TableauDeBordGrille from "./TableauDeBordGrille.vue";
import { useUserStore } from "@/stores/user.store";

import { default as baseCards } from "@/utils/TableauDeBordCardsList";

const userStore = useUserStore();

const cards = ref([]);

onMounted(() => {
    baseCards.map((card) => {
        let tmpCard = {
            name: card.name,
            icon: card.icon,
            actions: [],
            options: card.options,
        };
        if (
            card.permission === null ||
            userStore.hasPermission(card.permission) ||
            userStore.user.is_superuser
        ) {
            card.actions.map((cardData) => {
                if (
                    cardData.permission === null ||
                    userStore.hasPermission(cardData.permission) ||
                    userStore.user.is_superuser
                ) {
                    tmpCard.actions.push(cardData);
                }
            });
            cards.value.push(tmpCard);
        }
    });
});
</script>
