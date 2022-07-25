<template>
    <ValidationProvider :name="validationName" v-slot="{ errors }" :vid="id">
        <InputWrapper :hasErrors="!!errors.length">
            <div class="mb-3 text-G600"><slot name="info"></slot></div>

            <div>
                <TabList :tabs="tabs" v-model="currentTab" class="mb-4" />

                <InputError>{{ errors[0] }}</InputError>
                <RbTable :columns="columns" :data="data">
                    <template v-slot:cell="{ content, column }">
                        <Checkbox
                            :checkValue="content"
                            v-model="input"
                            v-if="column === 'checkbox'"
                            :disabled="disabled"
                        />
                        <span v-else-if="column === 'closedAt'">
                            <TownClosedAt :closedAt="content" />
                        </span>
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
import RbTable from "#app/components/Table/RbTable.vue";
import RbTableCell from "#app/components/Table/RbTableCell.vue";
import TownClosedAt from "#app/components/TownClosedAt/TownClosedAt.vue";
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
        nearbyClosedShantytowns: {
            type: Array
        }
    },

    components: {
        RbTable,
        RbTableCell,
        TownClosedAt,
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
                { id: "closedAt", label: "Fermé le" },
                { id: "population", label: "Nombre de personnes" }
            ],
            currentTab: this.defaultTab,
            search: ""
        };
    },

    computed: {
        displayClosedShantytowns() {
            return this.nearbyClosedShantytowns;
        },
        tabs() {
            return [
                {
                    id: "selected",
                    label: `Sites sélectionnés (${this.input.length})`
                },
                { id: "closed", label: "Sites fermés" }
            ];
        },
        data() {
            if (!this.displayClosedShantytowns) {
                return [];
            }

            const reg = new RegExp(this.search, "i");
            return this.displayClosedShantytowns
                .filter(({ id, status, city, usename }) => {
                    // filter by status
                    if (this.currentTab === "closed") {
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
                .map(({ id, city, usename, closedAt, populationTotal }) => {
                    return {
                        id,
                        checkbox: id,
                        city: city.name,
                        address: usename,
                        closedAt,
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
    }
};
</script>
