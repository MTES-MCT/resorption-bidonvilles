<template>
    <nav class="flex items-center">
        <label>Affichage :</label>
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
                    value: `thumbnail`,
                    label: `Vignettes`
                },
                {
                    value: `map`,
                    label: `Carte`
                }
            ]
        };
    },
    computed: {
        input: {
            get() {
                return this.$store.state.dashboard.dashboard.shantytowns
                    .display;
            },
            set(value) {
                this.$store.commit("setDashboardShantytownsDisplay", value);
            }
        }
    }
};
</script>
