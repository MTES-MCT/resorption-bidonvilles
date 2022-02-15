<template>
    <nav class="flex items-center">
        <label>Trier par :</label>
        <Select
            class="ml-2 mt-2"
            :withoutMargin="true"
            v-model="input"
            variant="link"
        >
            <SelectOption
                v-for="option in options"
                :key="option.value"
                :value="option.value"
                >{{ option.label }}</SelectOption
            >
        </Select>
    </nav>
</template>

<script>
export default {
    data() {
        return {
            options: [
                {
                    value: `cityName`,
                    label: `Commune`
                },
                {
                    value: `builtAt`,
                    label: `Date d'installation`
                },
                {
                    value: `updatedAt`,
                    label: `Date d'actualisation`
                },
                {
                    value: `declaredAt`,
                    label: `Date de signalement`
                }
            ]
        };
    },
    computed: {
        input: {
            get() {
                return this.$store.state.dashboard.dashboard.shantytowns.sort;
            },
            set(value) {
                this.$store.commit("setDashboardShantytownsSort", value);
            }
        }
    }
};
</script>
