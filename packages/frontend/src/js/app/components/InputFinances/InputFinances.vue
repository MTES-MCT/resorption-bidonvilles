<template>
    <ValidationProvider :name="validationName" v-slot="{ errors }" :vid="id">
        <InputWrapper :hasErrors="!!errors.length">
            <InputLabel :label="label" :showMandatoryStar="showMandatoryStar" />
            <div class="mb-3 text-G600"><slot name="info"></slot></div>

            <InputError>{{ errors[0] }}</InputError>
            <div class="flex justify-between mb-2">
                <Button
                    icon="chevron-left"
                    iconPosition="left"
                    variant="custom"
                    size="custom"
                    class="hover:bg-G200 rounded-full px-4 py-1 focus:outline-none "
                    @click="previousYear"
                    type="button"
                    >Année précédente</Button
                >
                <div class="font-bold text-lg">
                    Financements {{ currentYear }}
                </div>
                <Button
                    icon="chevron-right"
                    iconPosition="right"
                    variant="custom"
                    size="custom"
                    class="hover:bg-G200 rounded-full px-4 py-1 focus:outline-none "
                    @click="nextYear"
                    type="button"
                    :disabled="currentYear === maxYear"
                    >Année suivante</Button
                >
            </div>
            <InputFinancesYear
                v-model="currentYearData"
                :realAmount="realAmountForCurrentYear"
            />
        </InputWrapper>
    </ValidationProvider>
</template>

<script>
import InputLabel from "#app/components/ui/Form/utils/InputLabel.vue";
import InputFinancesYear from "./InputFinancesYear.vue";
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
        realAmount: {
            type: String, // either "none", "all" (for all years), "past" (for all years but current year)
            required: false,
            default: "none"
        },
        validationName: {
            type: String
        },
        id: {
            type: String
        }
    },

    components: {
        InputLabel,
        InputFinancesYear,
        InputWrapper,
        InputError
    },

    data() {
        const maxYear = new Date().getFullYear();

        return {
            input: this.value,
            maxYear,
            currentYear: maxYear
        };
    },

    created() {
        this.initYear(this.currentYear);
    },

    computed: {
        currentYearData() {
            const currentYearTable = this.input.find(({ year }) => {
                return year === this.currentYear;
            });

            return currentYearTable ? currentYearTable.data : [];
        },
        realAmountForCurrentYear() {
            if (this.realAmount === "none") {
                return "none";
            }

            if (this.realAmount === "all") {
                return "enabled";
            }

            return this.currentYear < this.maxYear ? "enabled" : "disabled";
        }
    },

    methods: {
        nextYear() {
            const target = Math.min(this.maxYear, this.currentYear + 1);
            this.initYear(target);
            this.currentYear = target;
        },
        previousYear() {
            this.initYear(this.currentYear - 1);
            this.currentYear -= 1;
        },
        initYear(targetYear) {
            const yearTable = this.input.find(({ year }) => {
                return year === targetYear;
            });

            if (!yearTable) {
                this.input.push({
                    year: targetYear,
                    data: []
                });
            }
        }
    }
};
</script>
