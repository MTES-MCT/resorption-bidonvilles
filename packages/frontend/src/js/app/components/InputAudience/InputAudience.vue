<template>
    <ValidationProvider
        :name="validationName"
        v-slot="{ errors }"
        :vid="validationName"
    >
        <InputWrapper :hasErrors="!!errors.length">
            <InputError>{{ errors[0] }}</InputError>

            <RbTable :columns="columns" :data="rows">
                <template v-slot:cell="{ column, row, content }">
                    <span v-if="column === 'label'" class="pre-line">{{
                        content
                    }}</span>
                    <TextInput
                        v-else
                        type="number"
                        v-model="input[rows[row].type][column]"
                        @change.native="onChange"
                    />
                </template>
            </RbTable>
        </InputWrapper>
    </ValidationProvider>
</template>

<script>
import RbTable from "#app/components/Table/RbTable.vue";
import InputWrapper from "#app/components/ui/Form/utils/InputWrapper.vue";
import InputError from "#app/components/ui/Form/utils/InputError.vue";

export default {
    props: {
        mode: {
            type: String, // either "in_and_out", "in_only", or "out_only"
            required: false,
            default: "in_and_out"
        },
        value: {
            type: Object,
            required: true
        },
        validationName: {
            type: String
        }
    },

    components: {
        RbTable,
        InputWrapper,
        InputError
    },

    data() {
        return {
            columns: [
                { id: "label", label: "" },
                { id: "families", label: "Ménages" },
                { id: "total", label: "Personnes" },
                { id: "women", label: "dont femmes (facultatif)" },
                { id: "minors", label: "dont mineurs (facultatif)" }
            ],
            input: this.normalizeInput({ ...this.value })
        };
    },

    computed: {
        rows() {
            const inRows = [
                {
                    label:
                        this.mode === "in_only"
                            ? "Publics intégrés au dispositif"
                            : "Entrées dans le dispositif",
                    type: "in"
                }
            ];

            const outRows = [
                {
                    label: `Sorties positivement
                        fin d'accompagnement social et/ou prise en charge dans un autre dispositif`,
                    type: "out_positive"
                },
                {
                    label: "Exclusion du dispositif",
                    type: "out_abandoned"
                },
                {
                    label: "Abandon / départ volontaire",
                    type: "out_excluded"
                }
            ];

            if (this.mode === "in_only") {
                return inRows;
            }

            if (this.mode === "out_only") {
                return outRows;
            }

            return [...inRows, ...outRows];
        }
    },

    methods: {
        normalizeInput(value) {
            if (this.mode === "in_only" || this.mode === "in_and_out") {
                value.in = value.in || this.defaultRow();
            } else {
                delete value.in;
            }

            if (this.mode === "out_only" || this.mode === "in_and_out") {
                value.out_positive = value.out_positive || this.defaultRow();
                value.out_abandoned = value.out_abandoned || this.defaultRow();
                value.out_excluded = value.out_excluded || this.defaultRow();
            } else {
                delete value.out_positive;
                delete value.out_abandoned;
                delete value.out_excluded;
            }

            return value;
        },
        defaultRow() {
            return {
                families: 0,
                total: 0,
                women: 0,
                minors: 0
            };
        },
        onChange() {
            this.$emit("input", { ...this.input });
        }
    },

    mounted() {
        this.$emit("input", { ...this.input });
    }
};
</script>
