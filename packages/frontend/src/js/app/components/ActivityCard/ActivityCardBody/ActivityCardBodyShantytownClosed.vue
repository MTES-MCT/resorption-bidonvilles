<template>
    <ActivityCardBodyShantytown :activity="activity">
        <template v-slot:title>Site fermé</template>
    </ActivityCardBodyShantytown>
</template>

<script>
import ActivityCardBodyShantytown from "./ActivityCardBodyShantytown.vue";

export default {
    components: {
        ActivityCardBodyShantytown
    },

    props: {
        activity: {
            type: Object,
            required: true
        }
    }
};
</script>
