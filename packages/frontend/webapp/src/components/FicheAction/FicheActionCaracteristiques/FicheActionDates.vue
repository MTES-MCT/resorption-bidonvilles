<template>
    <section>
        <FicheGrille>
            <template v-slot:col1>
                <Icon icon="calendar" class="mr-2" />
                <span class="font-bold">Débutée le</span>
            </template>

            <template v-slot:col2>
                {{ formatDate(action.started_at / 1000, "d M y") }} ({{
                    formatDateSince(action.started_at / 1000)
                }})
            </template>
        </FicheGrille>

        <FicheGrille v-if="action.ended_at">
            <template v-slot:col1>
                <span class="font-bold">
                    <template v-if="action.ended_at < Date.now()"
                        >Terminée le</template
                    >
                    <template v-else>Fin prévue le</template>
                </span>
            </template>

            <template v-slot:col2>
                {{ formatDate(action.ended_at / 1000, "d M y") }}
            </template>
        </FicheGrille>
    </section>
</template>

<script setup>
import { toRefs } from "vue";
import formatDate from "@common/utils/formatDate.js";
import formatDateSince from "@/utils/formatDateSince";

import FicheGrille from "@/components/FicheRubrique/FicheGrille.vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
</script>
