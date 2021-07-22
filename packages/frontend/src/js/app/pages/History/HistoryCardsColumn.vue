<template>
    <div>
        <ActivityCard
            v-for="(item, index) in items"
            :key="index"
            :activity="item"
            v-bind:class="{
                'pb-6 border-b mb-6': index < items.length - 1
            }"
        />
    </div>
</template>

<script>
import ActivityCard from "#app/components/ActivityCard/ActivityCard";

export default {
    props: {
        items: {
            type: Array,
            required: true
        }
    },
    components: {
        ActivityCard
    }
};
</script>
