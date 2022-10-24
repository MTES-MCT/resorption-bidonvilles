<template>
    <div>
        <div v-for="shantytownClosingSolution in shantytownClosingSolutions" :key="shantytownClosingSolution.id">
            <div v-if="showClosingSolutionDetails" class="mb-4">
                <div class="flex items-top customAlign">
                    <Icon icon="home" class="text-lg" />
                    <div class="font-bold ml-2">
                        {{
                                getClosingSolutionLabel(
                                    shantytownClosingSolution.id
                                )
                        }}
                    </div>
                </div>
                <div class="ml-8">
                    - {{ shantytownClosingSolution.peopleAffected }} personne{{
                            shantytownClosingSolution.peopleAffected > 1 ? "s" : " "
                    }}
                </div>
                <div v-if="shantytownClosingSolution.householdsAffected !== null">
                    <div class="ml-8">
                        -
                        {{ shantytownClosingSolution.householdsAffected }}
                        ménage{{
        shantytownClosingSolution.householdsAffected > 1
            ? "s"
            : " "
                        }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, computed } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    shantytownClosingSolutions: {
        type: Array
    }
});
const closingSolutions = computed(() => {
    const configStore = useConfigStore();
    return configStore.config.closing_solutions;
});

function getClosingSolutionLabel(id) {
    return closingSolutions.value.find(x => x.id === id).label;
}

function showClosingSolutionDetails() {
    return (
        props.shantytownClosingSolution.peopleAffected !== null &&
        props.shantytownClosingSolution.householdsAffected !== null
    );
}
</script>
