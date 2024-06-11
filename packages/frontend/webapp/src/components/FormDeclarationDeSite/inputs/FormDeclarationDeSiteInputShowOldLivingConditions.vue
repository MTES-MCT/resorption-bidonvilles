<template>
    <CheckableGroup
        id="show_old_living_conditions"
        direction="horizontal"
        :label="labels.show_old_living_conditions"
        info="Les questions apparaîtront grisées ci-dessous en consultation uniquement"
        showMandatoryStar
    >
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="show_old_living_conditions"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { watch } from "vue";
import { useFieldValue } from "vee-validate";
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import labels from "@/components/Common/FormEtFicheSite.labels";
import waitForElement from "@/utils/waitForElement";

const items = [
    { value: true, label: "Oui" },
    { value: false, label: "Non" },
];

const value = useFieldValue("show_old_living_conditions");
watch(value, () => {
    if (value.value === true) {
        waitForElement("#anciennes_conditions_de_vie", (el) => {
            setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
        });
    }
});
</script>
