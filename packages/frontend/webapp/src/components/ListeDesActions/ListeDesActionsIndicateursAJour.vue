<template>
    <ul
        v-if="statistics.dihal.total > 0 || statistics.sixMonths.total > 0"
        class="fr-raw-list fr-mb-0"
    >
        <li v-if="statistics.dihal.total > 0">
            <DsfrBadge
                :type="badges.dihal.variant"
                :label="badges.dihal.label"
                noIcon
                small
            />
            des actions actives en {{ previousYear }}, financées par la DIHAL
            ont des indicateurs mis à jour depuis moins de 3 mois ({{
                statistics.dihal.updated
            }}
            actions sur {{ statistics.dihal.total }} actives en
            {{ previousYear }})
        </li>
        <li v-if="statistics.sixMonths.total > 0">
            <DsfrBadge
                :type="badges.sixMonths.variant"
                :label="badges.sixMonths.label"
                noIcon
                small
            />
            des actions actives en {{ previousYear }} ont des indicateurs mis à
            jour dans les 6 derniers mois ({{
                statistics.sixMonths.updated
            }}
            actions sur {{ statistics.sixMonths.total }} actives en
            {{ previousYear }})
        </li>
    </ul>
</template>

<script setup>
defineProps({
    statistics: {
        type: Object,
        required: true,
    },
    badges: {
        type: Object,
        required: true,
    },
    previousYear: {
        type: Number,
        required: true,
    },
});
</script>
