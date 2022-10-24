<template>
    <LayoutError variant="interdit">
        <template v-slot:title>Accès refusé</template>
        <template v-slot:code>Droits d'accès insuffisants</template>
        <template v-slot:content
            >Vous avez essayé d'accéder à une page pour laquelle vous n'avez pas
            les droits nécessaires. Si vous pensez qu'il s'agit d'une erreur,
            n'hésitez pas à nous contacter.</template
        >
    </LayoutError>
</template>

<script setup>
import LayoutError from "@/components/LayoutError/LayoutError.vue";
</script>
