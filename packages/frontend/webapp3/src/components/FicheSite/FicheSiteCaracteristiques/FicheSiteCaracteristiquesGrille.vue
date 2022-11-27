<template>
    <FicheSiteSousRubrique>
        <div class="grid grid-cols-2">
            <div><slot name="col1" /></div>
            <div class="break-words"><slot name="col2" /></div>
        </div>
    </FicheSiteSousRubrique>
</template>

<script setup>
import FicheSiteSousRubrique from "../FicheSiteSousRubrique.vue";
</script>
