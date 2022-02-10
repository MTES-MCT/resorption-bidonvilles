<template>
    <div>
        <div class="flex justify-between mb-2">
            <Button
                icon="chevron-left"
                iconPosition="left"
                variant="custom"
                size="custom"
                class="hover:bg-G200 rounded-full px-4 py-1 focus:outline-none "
                @click="previousYear"
                type="button"
                :disabled="currentYear === minYear"
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
        <FinancesYear :rows="currentYearData" />
    </div>
</template>

<script>
import FinancesYear from "./FinancesYear.vue";

export default {
    props: {
        finances: {
            type: Array,
            required: true
        }
    },

    components: {
        FinancesYear
    },

    data() {
        const maxYear = new Date().getFullYear();

        return {
            maxYear,
            minYear: Math.min(
                ...this.finances
                    .filter(({ data }) => {
                        return data.length > 0;
                    })
                    .map(({ year }) => year),
                maxYear
            ),
            currentYear: maxYear
        };
    },

    computed: {
        currentYearData() {
            const currentYearTable = this.finances.find(({ year }) => {
                return year === this.currentYear;
            });

            return currentYearTable ? currentYearTable.data : [];
        }
    },

    methods: {
        nextYear() {
            this.currentYear = Math.min(this.maxYear, this.currentYear + 1);
        },
        previousYear() {
            this.currentYear = Math.max(this.minYear, this.currentYear - 1);
        }
    }
};
</script>
