<template>
    <div>
        <RbTable :columns="columns" :data="input">
            <template v-slot:cell="{ column, row }">
                <InputFinanceType
                    v-if="column === 'type'"
                    v-model="input[row].type"
                />
                <TextInput
                    type="number"
                    v-else-if="column === 'amount'"
                    v-model="input[row].amount"
                    :withoutMargin="true"
                />
                <TextInput
                    v-else-if="column === 'details'"
                    v-model="input[row].details"
                    :withoutMargin="true"
                />
                <span v-else-if="column === 'realAmount'">
                    <TextInput
                        v-if="realAmount === 'enabled'"
                        type="number"
                        v-model="input[row].realAmount"
                        :withoutMargin="true"
                    />
                    <span v-else>À renseigner l'année prochaine</span>
                </span>
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
            <Button @click="addRow" type="button"
                >Ajouter une ligne de financement</Button
            >
        </p>
    </div>
</template>

<script>
import RbTable from "#app/components/Table/RbTable.vue";
import InputFinanceType from "./inputs/InputFinanceType.vue";

export default {
    props: {
        value: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        },
        realAmount: {
            type: String, // either "none", "disabled", "enabled"
            required: false,
            default: "none"
        }
    },

    components: {
        RbTable,
        InputFinanceType
    },

    data() {
        return {
            input: this.value
        };
    },

    computed: {
        columns() {
            return [
                { id: "type", label: "Type de financements" },
                { id: "amount", label: "Montants prévus" },
                { id: "details", label: "Précision" },
                ...(this.realAmount !== "none"
                    ? [{ id: "realAmount", label: "Dépenses exécutées" }]
                    : []),
                { id: "remove", label: "" }
            ];
        }
    },

    watch: {
        value() {
            this.input = this.value;
        }
    },

    methods: {
        addRow() {
            this.input.push({
                type: undefined,
                amount: 0,
                realAmount: 0,
                details: ""
            });
        },
        removeRow(index) {
            this.input.splice(index, 1);
        }
    }
};
</script>
