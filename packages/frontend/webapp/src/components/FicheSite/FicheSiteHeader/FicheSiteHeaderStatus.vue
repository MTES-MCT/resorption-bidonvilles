<template>
    <div class="flex items-center uppercase text-sm">
        <div class="rounded-full h-3 w-3 mr-2" :class="lastUpdatedAtDotColor" />

        <p class="mr-4">
            {{ townStatus }}
        </p>
        <TagObjectifResorption
            v-if="town.resorptionTarget"
            :target="town.resorptionTarget"
        />
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import useLastUpdated from "@/composables/useLastUpdated";

import TagObjectifResorption from "@/components/TagObjectifResorption/TagObjectifResorption.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const { townStatus, lastUpdatedAtDotColor } = useLastUpdated(town);
</script>
