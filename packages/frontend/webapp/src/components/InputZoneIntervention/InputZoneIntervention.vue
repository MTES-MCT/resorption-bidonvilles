<template>
    <InputWrapper :hasErrors="error">
        <InputLocation
            v-bind="$attrs"
            :name="`${name}_input`"
            info="Commencez à saisir le nom d'une région, département, EPCI, ou commune, puis sélectionnez le territoire désiré dans la liste proposée"
            placeholder="Exemples : Île-de-France, Bordeaux Métropole, Rennes, Hérault, ..."
            autoClear
            ref="inputTerritorialCollectivity"
            v-model="autocomplete"
        />
        <InputZoneInterventionValeur
            :areas="value"
            @focusAutocomplete="() => inputTerritorialCollectivity.focus()"
            @remove="removeArea"
        />

        <InputError v-if="error">{{ error }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { ref, toRefs, watch } from "vue";
import { useField, useFieldError } from "vee-validate";
import { InputError, InputWrapper } from "@resorptionbidonvilles/ui";
import InputLocation from "@/components/InputLocation/InputLocation.vue";
import InputZoneInterventionValeur from "./InputZoneInterventionValeur.vue";

const props = defineProps({
    name: String,
});
const { name } = toRefs(props);
const { value, handleChange } = useField(name.value);
const error = useFieldError(name.value);

const inputTerritorialCollectivity = ref(null);
const autocomplete = ref({
    search: "",
    data: null,
});

function removeArea(area, index) {
    handleChange([
        ...value.value.slice(0, index),
        ...value.value.slice(index + 1),
    ]);
}

watch(autocomplete, () => {
    if (!autocomplete.value?.data) {
        return;
    }

    const { typeUid: type, code } = autocomplete.value.data;
    const { search: name } = autocomplete.value;
    if (!value.value.some((area) => area.code === code && area.type === type)) {
        handleChange([...value.value, { type, code, name }]);
    }
});
</script>
