<template>
    <ValidationProvider :name="validationName" v-slot="{ errors }" :vid="id">
        <InputWrapper :hasErrors="!!errors.length">
            <InputLabel :label="label" :showMandatoryStar="showMandatoryStar" />
            <div class="mb-3 text-G600"><slot name="info"></slot></div>

            <Spinner v-if="townsLoading"></Spinner>
            <div v-else>
                <TabList :tabs="tabs" v-model="currentTab" class="mb-4" />
                <TextInput
                    prefixIcon="search"
                    placeholder="Adresse, nom d'un site, ville..."
                    v-model="search"
                />
                <InputError>{{ errors[0] }}</InputError>
                <RbTable :columns="columns" :data="data">
                    <template v-slot:cell="{ content, column }">
                        <Checkbox
                            :checkValue="content"
                            v-model="input"
                            v-if="column === 'checkbox'"
                            :disabled="disabled"
                        />
                        <TownField
                            :fieldType="content"
                            v-else-if="column === 'fieldType'"
                        />
                        <span
                            v-else-if="column === 'population'"
                            class="block text-right"
                        >
                            <TownPopulation
                                v-if="content !== null"
                                class="justify-end"
                                :population="content"
                            />
                            <span v-else class="text-G600 italic">NC</span>
                        </span>
                        <RbTableCell v-else :content="content" />
                    </template>
                </RbTable>
            </div>
        </InputWrapper>
    </ValidationProvider>
</template>

<script>
import { mapGetters } from "vuex";
import InputLabel from "#app/components/ui/Form/utils/InputLabel.vue";
import RbTable from "#app/components/Table/RbTable.vue";
import RbTableCell from "#app/components/Table/RbTableCell.vue";
import TownField from "#app/components/TownField/TownField.vue";
import TownPopulation from "#app/components/TownPopulation/TownPopulation.vue";
import TabList from "#app/components/TabList/TabList.vue";
import InputWrapper from "#app/components/ui/Form/utils/InputWrapper.vue";
import InputError from "#app/components/ui/Form/utils/InputError.vue";

export default {
    props: {
        label: {
            type: String,
            required: false,
            default: ""
        },
        showMandatoryStar: {
            type: Boolean,
            required: false,
            default: false
        },
        value: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        },
        validationName: {
            type: String
        },
        id: {
            type: String
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    components: {
        InputLabel,
        RbTable,
        RbTableCell,
        TownField,
        TownPopulation,
        TabList,
        InputWrapper,
        InputError
    },

    data() {
        return {
            input: this.value,
            columns: [
                { id: "checkbox", label: "" },
                { id: "city", label: "Commune" },
                { id: "address", label: "Adresse" },
                { id: "fieldType", label: "Type de site" },
                { id: "population", label: "Nombre de personnes" }
            ],
            currentTab: "open",
            search: ""
        };
    },

    computed: {
        ...mapGetters({
            shantytowns: "towns",
            townsLoading: "townsLoading"
        }),
        tabs() {
            return [
                {
                    id: "selected",
                    label: `Sites sélectionnés (${this.input.length})`
                },
                { id: "open", label: "Sites ouverts" },
                { id: "closed", label: "Sites fermés" }
            ];
        },
        data() {
            if (!this.shantytowns) {
                return [];
            }

            const reg = new RegExp(this.search, "i");
            return this.shantytowns
                .filter(({ id, status, city, usename }) => {
                    // filter by status
                    if (this.currentTab === "open") {
                        if (status !== "open") {
                            return false;
                        }
                    } else if (this.currentTab === "closed") {
                        if (status === "open") {
                            return false;
                        }
                    } else {
                        // currentTab === "selected" here
                        if (!this.input.includes(id)) {
                            return false;
                        }
                    }

                    // filter by search
                    return (
                        this.search === "" ||
                        `${city.name} ${usename}`.match(reg)
                    );
                })
                .map(({ id, city, usename, fieldType, populationTotal }) => {
                    return {
                        id,
                        checkbox: id,
                        city: city.name,
                        address: usename,
                        fieldType,
                        population: populationTotal
                    };
                });
        }
    },

    watch: {
        value() {
            this.input = this.value;
        },

        input() {
            this.$emit("input", this.input);
        }
    },

    created() {
        this.load();
    },

    methods: {
        load() {
            if (!this.shantytowns.length) {
                this.$store.dispatch("fetchTowns");
            }
        }
    }
};
</script>
