<template>
    <div v-if="hasContent" class="flex flex-row gap-1 text-xs !font-normal text-error mt-2 items-center" aria-live="assertive">
        <span class="fr-icon-error-fill fr-icon--sm" aria-hidden="true"></span><slot />
    </div>
</template>

<script setup>
import { useSlots, computed } from "vue";

const slots = useSlots();

// On évite d'afficher l'icône s'il n'y a rien dans le slot
const hasContent = computed(() => {
  const nodes = slots.default?.() || [];
  return nodes.some(n => typeof n.children !== "string" || n.children.trim().length > 0);
});
</script>
