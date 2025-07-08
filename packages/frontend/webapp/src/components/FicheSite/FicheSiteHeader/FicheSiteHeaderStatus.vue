<template>
    <div class="flex flex-col">
        <div class="flex items-center uppercase text-sm">
            <div
                class="rounded-full h-3 w-3 mr-2"
                :class="lastUpdatedAtDotColor"
            />

            <p class="mr-4">
                {{ townStatus }}
            </p>
            <TagObjectifResorption
                v-if="town.resorptionTarget"
                :target="town.resorptionTarget"
                class="mr-4"
            />
        </div>
        <FicheSiteHeaderStatusLastEvent
            v-if="town.changelog.length || town.comments.length"
            :town="town"
        />
        <div v-else>
            <p class="font-semibold text-black">
                Site déclaré le
                {{ formatDate(town.createdAt, "d M y") }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import useLastUpdated from "@/composables/useLastUpdated";
import FicheSiteHeaderStatusLastEvent from "@/components/FicheSite/FicheSiteHeader/FicheSiteHeaderStatusLastEvent.vue";
import TagObjectifResorption from "@/components/TagObjectifResorption/TagObjectifResorption.vue";
import formatDate from "@common/utils/formatDate";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const { townStatus, lastUpdatedAtDotColor } = useLastUpdated(town);
</script>
