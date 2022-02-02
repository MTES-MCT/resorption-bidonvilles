<template>
    <div>
        <InputLabel :label="label" :showMandatoryStar="showMandatoryStar" />
        <div class="mb-3 text-G600"><slot name="info"></slot></div>

        <RbTable :columns="columns" :data="input">
            <template v-slot:cell="{ column, row }">
                <InputEtpType
                    v-if="column === 'type'"
                    v-model="input[row].type"
                    :withoutMargin="true"
                />
                <TextInput
                    v-else-if="column === 'total'"
                    v-model="input[row].total"
                    :withoutMargin="true"
                />
                <span v-else-if="column === 'remove'">
                    <Button
                        variant="primaryText"
                        icon="trash-alt"
                        type="button"
                        @click="removeRow(row)"
                    />
                </span>
            </template>
        </RbTable>
        <p class="mt-4 text-right">
            <Button @click="addRow" type="button">Ajouter une ligne</Button>
        </p>
    </div>
</template>

<script>
import RbTable from "#app/components/Table/RbTable.vue";
import InputLabel from "#app/components/ui/Form/utils/InputLabel.vue";
import InputEtpType from "#app/components/InputEtpType/InputEtpType.vue";

export default {
    props: {
        value: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        },
        label: {
            type: String,
            required: false
        },
        showMandatoryStar: {
            type: Boolean,
            required: false
        },
        info: {
            type: String,
            required: false
        }
    },

    components: {
        RbTable,
        InputLabel,
        InputEtpType
    },

    data() {
        return {
            input: this.value,
            columns: [
                { id: "type", label: "Fonction" },
                { id: "total", label: "Nombre d'ETP" },
                { id: "remove", label: "" }
            ]
        };
    },

    methods: {
        addRow() {
            this.input.push({
                type: undefined,
                total: 0
            });
        },
        removeRow(index) {
            this.input.splice(index, 1);
        }
    }
};
</script>
