<template>
    <p class="font-bold">{{ label }}</p>
    <DsfrSelect
        id="organization_other_territory"
        :errorMessage="errors.length > 0 ? errors[0] : ''"
        :success-message="
            organizationOtherTerritory?.length > 0 &&
            errors.length === 0 &&
            `${matrice[type].label} de la structure valide`
        "
        :defaultUnselectedText="unselectedOption"
        :disabled="isSubmitting || disabled"
        v-model="organizationOtherTerritory"
        :options="options"
        @blur="handleBlur"
    />
</template>

<script setup>
import { computed, onMounted, ref, toRefs, watch } from "vue";
import { useField, useIsSubmitting } from "vee-validate";
import { get } from "@/api/territory";

const props = defineProps({
    label: String,
    type: String,
    disabled: Boolean,
});
const { label, type, disabled } = toRefs(props);

const isSubmitting = useIsSubmitting();
const {
    value: organizationOtherTerritory,
    errors,
    handleBlur,
} = useField("organization_other_territory", "required");

const options = ref([]);
const matrice = {
    Régional: {
        label: "Région",
        search: "regions",
    },
    Départemental: {
        label: "Département",
        search: "departements",
    },
};

const unselectedOption = computed(() => {
    let text = "Sélectionner un";
    if (matrice[type.value].label === "Région") {
        text += "e région";
    } else {
        text += " département";
    }
    return text;
});

const getTerritoryOptions = async () => {
    const response = await get(matrice[type.value].search);
    options.value = response.map((option) => option.name);
};

onMounted(() => {
    getTerritoryOptions();
});

watch(type, () => {
    getTerritoryOptions();
});
</script>
