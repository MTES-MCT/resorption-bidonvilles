<template>
    <FicheSousRubrique>
        <div class="grid grid-cols-2">
            <div><slot name="col1" /></div>
            <div class="break-words"><slot name="col2" /></div>
        </div>
    </FicheSousRubrique>
</template>

<script setup>
import FicheSousRubrique from "./FicheSousRubrique.vue";
</script>
