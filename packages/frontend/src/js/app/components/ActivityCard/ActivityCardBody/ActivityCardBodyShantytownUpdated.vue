<template>
    <ActivityCardBodyShantytown :activity="activity">
        <template v-slot:title>Site mis à jour</template>

        <template v-slot:body>
            <p class="italic">Champs modifiés : {{ fieldList }}</p>
        </template>
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
    },

    computed: {
        fieldList() {
            return this.activity.diff.map(({ field }) => field).join(", ");
        }
    }
};
</script>
