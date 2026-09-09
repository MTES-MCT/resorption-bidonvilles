<template>
    <div>
        <p>
            <span class="font-bold">Champ(s) modifié(s) :</span><br />
            {{ fieldList }}
        </p>

        <div class="mt-2">
            <Button
                variant="text"
                :icon="toggleIcon"
                iconPosition="left"
                class="text-display-sm font-bold hover:underline"
                :padding="false"
                @click="toggle"
                >{{ toggleWording }} le détail des modifications</Button
            >

            <div v-if="showDetails" class="bg-G100 py-4 px-6">
                <div v-for="item in activity.diff" :key="item.fieldKey">
                    <p class="text-info">{{ item.field }}</p>
                    <p>
                        <span class="line-through">
                            {{ item.oldValue || "non renseigné" }}
                        </span>
                        <span>
                            ,
                            {{ item.newValue || "non renseigné" }}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { toRefs, ref, computed } from "vue";
import { Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    activity: {
        type: Object,
    },
});
const { activity } = toRefs(props);
const showDetails = ref(false);

const fieldList = computed(() => {
    let list = activity.value.diff.map(({ field }) => field);

    return list.join(", ");
});

const toggleIcon = computed(() => {
    return showDetails.value ? "chevron-up" : "chevron-down";
});

const toggleWording = computed(() => {
    return showDetails.value ? "Masquer" : "Voir";
});

function toggle() {
    showDetails.value = !showDetails.value;
}
</script>
