<template>
    <RouterLink custom v-slot="{ navigate }" :to="`/action/${action.id}`">
        <div
            :class="[
                'rounded-sm cursor-pointer border-1 border-cardBorder',
                isHover ? 'bg-blue200 border-transparent' : '',
                focusClasses.ring,
            ]"
            :aria-label="`Fiche action ${action.name}`"
            @click="navigate"
            @mouseenter="isHover = true"
            @mouseleave="isHover = false"
        >
            <div
                class="mb-4 px-6 -mt-1 pt-px flex flex-col sm:flex-row justify-between sm:gap-2"
            >
                <div class="flex flex-col sm:flex-row gap-2 -mt-[1px]">
                    <DsfrBadge
                        :label="actionPeriod"
                        noIcon
                        type="info"
                        class="mt-1 lg:place-self-end text-xs py-2"
                    />
                    <DsfrBadge
                        :label="metricsUpdatedAtLabel"
                        noIcon
                        :type="metricsUpdatedAtBadgeType"
                        class="mt-1 lg:place-self-end text-xs py-2"
                    />
                </div>
                <div class="mt-[3px]" v-if="attachmentsLabel">
                    <DsfrBadge
                        :label="attachmentsLabel"
                        type="info"
                        class="lg:place-self-end text-xs items-center py-1.5"
                    />
                </div>
            </div>

            <div class="px-6 text-primary text-display-md font-bold">
                {{ action.name }}
            </div>

            <div
                class="lg:grid cardGridTemplateColumnsSmall lg:cardGridTemplateColumnsLarge gap-10 px-6 py-4"
            >
                <CarteActionColonneChampsIntervention :topics="action.topics" />
                <CarteActionDetailleeColonneDepartement
                    :departement="action.location.departement"
                />
                <CarteActionDetailleeColonneLocalisation :action="action" />
                <CarteActionDetailleeColonnePilote
                    :managers="action.managers"
                />
                <CarteActionDetailleeColonneOperateur
                    :operators="action.operators"
                />
            </div>

            <div
                class="flex justify-end h-14 items-center mr-4 space-x-4 print:hidden"
            >
                <DsfrButton
                    v-if="hasUpdateShantytownPermission"
                    size="sm"
                    label="Mettre à jour"
                    icon="fr-icon-pencil-line"
                    secondary
                    @click.prevent.stop="navigateTo('mise-a-jour')"
                />
                <DsfrButton
                    size="sm"
                    label="Voir la fiche de l'action"
                    icon="fr-icon-arrow-right-line"
                    primary
                    @click.prevent.stop="navigateTo(null)"
                />
            </div>
        </div>
    </RouterLink>
</template>

<script setup>
import { computed, toRefs, ref } from "vue";
import formatDate from "@common/utils/formatDate";
import formatMetricsUpdatedAt from "@/utils/formatMetricsUpdatedAt";
import getSince from "@/utils/getSince";
import focusClasses from "@common/utils/focus_classes";

import { RouterLink, useRouter } from "vue-router";
import CarteActionColonneChampsIntervention from "./CarteActionColonneChampsIntervention.vue";
import CarteActionDetailleeColonneDepartement from "./CarteActionDetailleeColonneDepartement.vue";
import CarteActionDetailleeColonneLocalisation from "./CarteActionDetailleeColonneLocalisation.vue";
import CarteActionDetailleeColonnePilote from "./CarteActionDetailleeColonnePilote.vue";
import CarteActionDetailleeColonneOperateur from "./CarteActionDetailleeColonneOperateur.vue";
import { useUserStore } from "@/stores/user.store";
import { useRouter } from "vue-router";

const props = defineProps({
    action: {
        type: Object,
    },
});

const { action } = toRefs(props);
const userStore = useUserStore();
const router = useRouter();

const isHover = ref(false);

const actionPeriod = computed(() => {
    if (action.value.ended_at) {
        return (
            "Action réalisée du " +
            formatDate(action.value.started_at / 1000, "d/m/y") +
            " au " +
            formatDate(action.value.ended_at / 1000, "d/m/y")
        );
    } else {
        return (
            "Action en cours depuis le " +
            formatDate(action.value.started_at / 1000, "d/m/y")
        );
    }
});

const hasUpdateShantytownPermission = computed(() => {
    return userStore.hasUpdateShantytownPermission(action.value);
});

const attachmentsLabel = computed(() => {
    const commentsAttachments = action.value.comments.reduce((sum, comment) => {
        return sum + (comment.attachments ? comment.attachments.length : 0);
    }, 0);

    if (commentsAttachments > 1) {
        return `${commentsAttachments} Documents partagés`;
    }
    if (commentsAttachments === 0) {
        return null;
    }
    return `${commentsAttachments} Document partagé`;
});

const metricsUpdatedAtLabel = computed(() => {
    return formatMetricsUpdatedAt(action.value);
});

const metricsUpdatedAtBadgeType = computed(() => {
    if (!action.value.metrics_updated_at) {
        return "warning";
    }
    const { months } = getSince(action.value.metrics_updated_at / 1000);
    return months >= 3 ? "error" : "success";
});

const navigateTo = (target) => {
    if (action.value && action.value.id) {
        let path = `/action/${action.value.id}`;
        if (target) {
            path += `/${target}`;
        }
        router.push(path);
    }
};
</script>

<style scoped lang="scss">
.cardGridTemplateColumnsLarge {
    grid-template-columns: 222px 208px auto 300px 200px;
}
.cardGridTemplateColumnsSmall {
    grid-template-columns: 111px 104px auto 200px 150px;
}
</style>
