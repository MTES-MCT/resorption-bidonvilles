<template>
    <span
        :class="[
            'mb-4 cursor-pointer',
            isActive
                ? 'text-primary border-l-4 pl-2 border-primary font-bold'
                : 'hover:underline'
        ]"
        @click="setFilter"
    >
        {{ label }}
    </span>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        }
    },

    computed: {
        isActive() {
            return (
                this.$store.state.dashboard.dashboard.activities.filter ===
                this.id
            );
        }
    },

    methods: {
        setFilter() {
            this.$store.commit(
                "dashboard/setDashboardActivitiesFilter",
                this.id
            );
        }
    }
};
</script>
