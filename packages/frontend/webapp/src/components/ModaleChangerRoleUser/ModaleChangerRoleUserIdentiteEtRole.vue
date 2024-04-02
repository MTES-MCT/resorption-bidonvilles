<template>
    <FicheGrille :border="false" :marginTop="false">
        <template v-slot:col1>
            <p class="font-bold">Nom Prénom</p>
            <p>{{ user.firstName }} {{ user.lastName }}</p>
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
import { toRefs } from "vue";
import FicheGrille from "@/components/FicheRubrique/FicheGrille.vue";

const props = defineProps({
    user: Object,
});
const { user } = toRefs(props);
</script>
