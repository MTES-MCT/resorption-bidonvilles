<template>
    <div class="flex align-center justify-center">
        <Button
            class="self-center"
            @click="onPrev"
            :disabled="year === 2020"
            icon="chevron-left"
            variant="primaryText"
        />
        <table class="table-auto credits-table">
            <thead class="font-bold">
                <tr>
                    <td>Origine des financements ({{ year }})</td>
                    <td>Montant</td>
                </tr>
            </thead>
            <tbody>
                <tr v-if="credits[year]">
                    <td>Financements étatiques hors crédits dédiés</td>
                    <td>
                        {{ formatValue(credits[year].etatique) }}
                    </td>
                </tr>
                <tr v-if="credits[year]">
                    <td>Crédits dédiés à la résorption des bidonvilles</td>
                    <td>{{ formatValue(credits[year].dedie) }}</td>
                </tr>
                <tr v-if="credits[year]">
                    <td>Cofinancement collectivité territoriale</td>
                    <td>{{ formatValue(credits[year].collectivite) }}</td>
                </tr>
                <tr v-if="credits[year]">
                    <td>Financements privés</td>
                    <td>{{ formatValue(credits[year].prive) }}</td>
                </tr>
                <tr v-if="credits[year]">
                    <td>Financements européens</td>
                    <td>{{ formatValue(credits[year].europe) }}</td>
                </tr>
                <tr v-if="credits[year]">
                    <td>Autre</td>
                    <td>{{ formatValue(credits[year].autre) }}</td>
                </tr>
                <tr class="font-bold">
                    <td>Total</td>
                    <td>{{ formatValue(total) }}</td>
                </tr>
            </tbody>
        </table>
        <Button
            class="self-center"
            @click="onNext"
            :disabled="year === currentYear"
            icon="chevron-right"
            variant="primaryText"
        />
    </div>
</template>

<script>
export default {
    props: {
        credits: {
            type: Object
        }
    },
    data() {
        const currentYear = new Date().getFullYear();

        return {
            currentYear: currentYear,
            year: currentYear
        };
    },
    methods: {
        onNext() {
            this.year = this.year + 1;
        },
        onPrev() {
            this.year = this.year - 1;
        },
        formatValue(val) {
            return val ? `${val.toLocaleString("fr")} €` : "-";
        }
    },
    computed: {
        total() {
            if (!this.credits || !this.credits[this.year]) {
                return 0;
            }

            return Object.values(this.credits[this.year]).reduce(
                (acc, obj) => acc + obj,
                0
            );
        }
    }
};
</script>

<style scoped>
.credits-table td {
    @apply border px-4 py-2;
}
</style>
