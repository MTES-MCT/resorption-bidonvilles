<template>
    <div>
        <InputLabel :label="label" :showMandatoryStar="showMandatoryStar" />
        <div class="mb-3 text-G600"><slot name="info"></slot></div>

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
            <div class="font-bold text-lg">Financements {{ currentYear }}</div>
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
        <InputFinancesYear v-model="currentYearData" />
    </div>
</template>

<script>
import InputLabel from "#app/components/ui/Form/utils/InputLabel.vue";
import InputFinancesYear from "./InputFinancesYear.vue";

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
        }
    },

    components: {
        InputLabel,
        InputFinancesYear
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
