<template>
    <DsfrCheckbox
        :value="true"
        :label="label"
        :errorMessage="errors.length > 0 ? errors[0] : ''"
        name="legal"
        id="legal"
        small
        inline
        v-model="legal"
        @update="handleBlur"
        :valid-message="
            legal === true &&
            errors.length === 0 &&
            `Le champ '${label}' est valide`
        "
    />
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
    label: String,
});
const { label } = toRefs(props);

const { value: legal, errors, handleBlur } = useField("legal", "required");
</script>

<style scoped>
.fr-fieldset__element {
    padding-left: 0 !important;
    padding-right: 0 !important;
}
</style>
