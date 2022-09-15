<template>
    <ValidationProvider :name="validationName" v-slot="{ errors }" :vid="id">
        <InputWrapper :hasErrors="!!errors.length">
            <InputLabel :label="label" :showMandatoryStar="showMandatoryStar" />
            <div class="mb-6 text-G600"><slot name="info"></slot></div>

            <Spinner v-if="townsLoading"></Spinner>
            <div v-else>
                <TabList :tabs="tabs" v-model="currentTab" class="mb-4" />
                <TextInput
                    prefixIcon="search"
                    placeholder="Adresse, nom d'un site, ville..."
                    v-model="search"
                />
                <InputError>{{ errors[0] }}</InputError>
                <RbTable
                    :columns="columnsWithDefinition"
                    :data="currentTabData"
                    @datachange="resyncInput"
                >
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
                        <span
                            v-else-if="column === 'closedAt'"
                            class="inline-block italic text-center w-full"
                        >
                            {{ content }}
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
        defaultTab: {
            type: String,
            required: false,
            default: "open"
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
        },
        customFilter: {
            type: Function,
            required: false,
            default: null
        },
        columns: {
            type: Array,
            required: false,
            default() {
                return ["city", "address", "fieldType", "population"];
            }
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
            columnsDefinition: [
                { id: "city", label: "Commune" },
                { id: "address", label: "Adresse" },
                { id: "fieldType", label: "Type de site" },
                { id: "population", label: "Nombre de personnes" },
                { id: "closedAt", label: "Statut du site" }
            ],
            currentTab: this.defaultTab,
            search: ""
        };
    },

    computed: {
        ...mapGetters({
            shantytowns: "towns",
            townsLoading: "townsLoading"
        }),
        columnsWithDefinition() {
            return [
                { id: "checkbox", label: "" },
                ...this.columnsDefinition.filter(({ id }) =>
                    this.columns.includes(id)
                )
            ];
        },
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
        allTabsData() {
            if (!this.shantytowns || this.shantytowns.length === 0) {
                return [];
            }

            return this.shantytowns.filter(
                town => !this.customFilter || this.customFilter(town)
            );
        },
        currentTabData() {
            const reg = new RegExp(this.search, "i");
            return this.allTabsData
                .filter(({ id, status, city, usename }) => {
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
                .map(
                    ({
                        id,
                        city,
                        usename,
                        fieldType,
                        populationTotal,
                        closedAt
                    }) => {
                        return {
                            id,
                            checkbox: id,
                            city: city.name,
                            address: usename,
                            fieldType,
                            population: populationTotal,
                            closedAt: closedAt
                                ? `Fermé le ${App.formatDate(
                                      closedAt,
                                      "d/m/y"
                                  )}`
                                : "Ouvert"
                        };
                    }
                );
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
        },

        resyncInput() {
            const newInput = this.input.filter(selectedId => {
                return this.allTabsData.some(({ id }) => id === selectedId);
            });

            // actually update the input ONLY in case of change, to avoid cyclic calls
            if (newInput.length !== this.input.length) {
                this.input = newInput;
            }
        }
    }
};
</script>
$
