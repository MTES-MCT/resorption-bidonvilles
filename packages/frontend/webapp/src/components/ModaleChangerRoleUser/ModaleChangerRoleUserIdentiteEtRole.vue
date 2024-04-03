<template>
    <FicheGrille :border="false" :marginTop="false">
        <template v-slot:col1>
            <p class="font-bold">Nom Prénom</p>
            <p>{{ formattedFirstName }} {{ user.lastName.toUpperCase() }}</p>
        </template>

        <template v-slot:col2>
            <p class="font-bold">Rôle actuel</p>
            <p>
                {{ user.roleName }}
            </p>
        </template>
    </FicheGrille>
</template>

<script setup>
import { computed, toRefs } from "vue";
import FicheGrille from "@/components/FicheRubrique/FicheGrille.vue";
import majFirstName from "@common/utils/stringUtils";

const props = defineProps({
    user: Object,
});
const { user } = toRefs(props);
const formattedFirstName = computed(() => majFirstName(user.value.firstName));
</script>
