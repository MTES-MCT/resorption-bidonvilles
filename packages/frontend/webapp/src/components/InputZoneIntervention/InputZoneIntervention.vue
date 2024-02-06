<template>
    <InputWrapper :hasErrors="error">
        <InputLocation
            v-bind="$attrs"
            :name="`${name}_input`"
            label="Ajouter des territoires"
            info="Commencez à saisir le nom d'une région, département, EPCI, ou commune, puis sélectionnez le territoire désiré dans la liste proposée"
            placeholder="Exemples : Île-de-France, Bordeaux Métropole, Rennes, Hérault, ..."
            autoClear
            ref="inputTerritorialCollectivity"
            v-model="autocomplete"
        />

        <div
            class="w-full border-dashed border-2 border-G500"
            :class="{
                'h-48 cursor-pointer': value.length === 0,
                'min-h-48': value.length > 0,
            }"
            @click="
                () => {
                    if (value.length === 0) {
                        inputTerritorialCollectivity.focus();
                    }
                }
            "
        >
            <template v-if="value.length === 0">
                <div
                    class="flex flex-col h-full justify-center items-center text-G500 text-3xl"
                >
                    <Icon icon="square-dashed-circle-plus" />
                    <p class="text-center">
                        Ajoutez des territoires<br />
                        <span class="text-xl"
                            >Remplissez le champ ci-dessus pour ajouter des
                            territoires</span
                        >
                    </p>
                </div>
            </template>

            <template v-else>
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 m-4 gap-2"
                >
                    <div
                        v-for="(area, index) in value"
                        :key="`${area.type}-${area.code}`"
                        class="px-4 py-3 border border-b-3 border-b-primary flex justify-between"
                    >
                        <p>
                            <span class="text-md font-bold text-primary">{{
                                TYPE_LABELS[area.type]
                            }}</span
                            ><br />
                            {{ area.name }}
                        </p>
                        <p class="hover:text-primary self-end">
                            <Button
                                type="button"
                                :padding="false"
                                variant="primaryText"
                                icon="trash-alt"
                                iconPosition="left"
                                @click="removeArea(area, index)"
                            />
                        </p>
                    </div>
                </div>
            </template>
        </div>

        <InputError v-if="error">{{ error }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { ref, toRefs, watch } from "vue";
import { useField, useFieldError } from "vee-validate";
import {
    Button,
    InputError,
    InputWrapper,
    Icon,
} from "@resorptionbidonvilles/ui";
import InputLocation from "@/components/InputLocation/InputLocation.vue";

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

const TYPE_LABELS = {
    region: "Région",
    departement: "Département",
    epci: "EPCI",
    city: "Commune",
};

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
