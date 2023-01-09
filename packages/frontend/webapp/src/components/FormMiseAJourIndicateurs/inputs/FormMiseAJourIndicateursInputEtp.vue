<template>
    <TableauRb :columns="columns" :data="values.etp">
        <template v-slot:cell="{ column, row }">
            <InputEtpType
                :name="`etp[${row}].type`"
                v-if="column === 'type'"
                :withoutMargin="true"
            />
            <TextInput
                :name="`etp[${row}].total`"
                v-else-if="column === 'total'"
                step="0.01"
                :withoutMargin="true"
                type="number"
            />
            <span v-else-if="column === 'remove'">
                <Button
                    variant="primaryText"
                    icon="trash-alt"
                    type="button"
                    @click="removeRow(row)"
                />
            </span> </template
    ></TableauRb>
    <p class="mt-4 text-right">
        <Button @click="addRow" type="button">Ajouter une ligne</Button>
    </p>
</template>

<script setup>
import { ref } from "vue";
import { useFormValues } from "vee-validate";

import { Button, TextInput } from "@resorptionbidonvilles/ui";
import TableauRb from "@/components/Tableau/TableauRb.vue";
import InputEtpType from "@/components/InputEtpType/InputEtpType.vue";

const values = useFormValues();

const columns = ref([
    { id: "type", label: "Fonction" },
    { id: "total", label: "Nombre d'ETP" },
    { id: "remove", label: "" },
]);

function addRow() {
    if (!values.value.etp) {
        values.value.etp = [];
    }
    values.value.etp.push({
        type: { uid: null },
        total: 0,
    });
}
function removeRow(index) {
    values.value.etp.splice(index, 1);
}
</script>
