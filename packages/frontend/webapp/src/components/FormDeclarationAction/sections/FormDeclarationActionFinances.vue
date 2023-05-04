<template>
    <FormSection id="financements">
        <template v-slot:title>Financements</template>
        <template v-slot:detail v-if="managers?.length > 0">
            <div>
                <Button
                    type="button"
                    size="sm"
                    icon="user-group"
                    iconPosition="left"
                    variant="primaryText"
                    @click="openListAccesActionFinances"
                >
                    Qui aura accès aux données sur les financements ?
                </Button>
            </div>
        </template>
        <FormDeclarationActionInputFinances />
    </FormSection>

    <ModaleListeAccesActionFinancements
        ref="modaleListeAccesActionFinancements"
        :managers="managers"
        :future="true"
    />
</template>

<script setup>
import { ref, toRefs, watch } from "vue";
import { useEventBus } from "@common/helpers/event-bus";

import FormSection from "@/components/FormSection/FormSection.vue";
import FormDeclarationActionInputFinances from "../inputs/FormDeclarationActionInputFinances.vue";
import { Button } from "@resorptionbidonvilles/ui";
import ModaleListeAccesActionFinancements from "@/components/ModaleListeAccesActionFinancements/ModaleListeAccesActionFinancements.vue";

const { emit, bus } = useEventBus();

const props = defineProps({
    managers: Array,
});
const { managers } = toRefs(props);

function openListAccesActionFinances() {
    emit("formdeclarationactionfinances:openListAccesActionFinancements");
}

const modaleListeAccesActionFinancements = ref(null);

watch(
    () =>
        bus.value.get(
            "formdeclarationactionfinances:openListAccesActionFinancements"
        ),
    () => {
        modaleListeAccesActionFinancements.value.open();
    }
);
</script>
