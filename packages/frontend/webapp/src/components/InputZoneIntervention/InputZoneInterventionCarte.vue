<template>
    <div
        class="px-4 py-3 border border-b-3 border-b-primary flex justify-between"
    >
        <p>
            <span class="text-md font-bold text-primary">{{
                TYPE_LABELS[area.type]
            }}</span
            ><br />
            {{ area.name }}
        </p>
        <p class="hover:text-primary self-end">
            <Button
                type="button"
                :padding="false"
                variant="primaryText"
                icon="trash-alt"
                iconPosition="left"
                @click="emit('remove')"
            />
        </p>
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import { Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    area: {
        type: Object,
        required: true,
    },
});
const { area } = toRefs(props);
const emit = defineEmits(["remove"]);

const TYPE_LABELS = {
    region: "Région",
    departement: "Département",
    epci: "EPCI",
    city: "Commune",
};
</script>
