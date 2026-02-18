<template>
    <div class="mb-6 bg-red200 text-error px-2 py-3 relative" role="alert">
        <span class="absolute -left-4 bg-error w-0.5 h-full top-0"></span>
        <div class="flex flex-row gap-1" v-if="message">
        <span class="fr-icon-error-fill fr-icon--sm" aria-hidden="true"></span>
        <span class="font-normal" v-html="message"></span>
        </div>
        <ul v-if="summaryErrors.length > 0" class="mt-2 pl-5 list-disc">
            <li v-for="error in summaryErrors" :key="error.key" class="list-none flex flex-row gap-1">
                <span class="fr-icon-error-fill fr-icon--xs" aria-hidden="true"></span>
                <span 
                    @click="focusField(error.key)"
                    class="text-error hover:underline cursor-pointer"
                >
                    {{ error.message }}
                </span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";

const props = defineProps({
    message: {
        type: String,
        required: true,
    },
    summary: {
        type: Object,
        required: false,
        default: () => ({})
    }
});

const { message, summary } = toRefs(props);
const summaryErrors = computed(() => {
    if (!summary.value) {
        return [];
    }
    return Object.keys(summary.value).map((key) => ({
        key,
        message: summary.value[key]
    }));
});

const focusField = (fieldKey) => {
    // Essayer de trouver l'élément par son ID
    let field = document.getElementById(fieldKey);
    
    // Si non trouvé, essayer avec le préfixe du DatePicker
    if (!field) {
        field = document.getElementById(`dp-input-${fieldKey}`);
    }
    
    if (field) {
        // Scroller vers le champ
        field.scrollIntoView({ behavior: "smooth", block: "center" });
        
        // Focus après le scroll
        setTimeout(() => {
            const focusable =
                field instanceof HTMLInputElement ||
                field instanceof HTMLTextAreaElement ||
                field instanceof HTMLSelectElement
                ? field
                : field.querySelector("input, textarea, select");

            focusable?.focus({ preventScroll: true });
        }, 500);
    }
};
</script>