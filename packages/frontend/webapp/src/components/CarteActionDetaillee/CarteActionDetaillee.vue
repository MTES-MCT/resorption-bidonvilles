<template>
    <RouterLink custom v-slot="{ navigate }" :to="`/action/${action.id}`">
        <div
            :class="[
                'rounded-sm cursor-pointer border-1 border-cardBorder',
                isHover ? 'bg-blue200 border-transparent' : '',
                focusClasses.ring,
            ]"
            :aria-label="`Fiche action ${action.name}`"
            tabindex="0"
            @click="navigate"
            @mouseenter="isHover = true"
            @mouseleave="isHover = false"
        >
            <div
                class="mb-4 px-6 -mt-1 pt-px flex flex-col sm:flex-row justify-between sm:gap-2"
            >
                <div>
                    <Tag
                        tabindex="0"
                        :aria-label="actionPeriod"
                        :class="[
                            'text-xs uppercase text-primary',
                            isHover ? 'shadow-md' : '',
                        ]"
                    >
                        <span>
                            {{ actionPeriod }}
                        </span>
                    </Tag>
                </div>
                <div class="mt-[3px]" v-if="attachmentsLabel">
                    <Tag
                        tabindex="1"
                        :aria-label="attachmentsLabel"
                        variant="highlight"
                        :class="[
                            'text-xs uppercase text-primary justify-self-end items-center gap-2',
                            isHover ? 'shadow-md' : '',
                        ]"
                        ><Icon icon="paperclip" class="text-xs md:text-md" />
                        {{ attachmentsLabel }}</Tag
                    >
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

            <div class="flex justify-end px-4 py-4">
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
import focusClasses from "@common/utils/focus_classes";

import { RouterLink } from "vue-router";
import { Icon, Link, Tag } from "@resorptionbidonvilles/ui";
import CarteActionColonneChampsIntervention from "./CarteActionColonneChampsIntervention.vue";
import CarteActionDetailleeColonneDepartement from "./CarteActionDetailleeColonneDepartement.vue";
import CarteActionDetailleeColonneLocalisation from "./CarteActionDetailleeColonneLocalisation.vue";
import CarteActionDetailleeColonnePilote from "./CarteActionDetailleeColonnePilote.vue";
import CarteActionDetailleeColonneOperateur from "./CarteActionDetailleeColonneOperateur.vue";

const props = defineProps({
    action: {
        type: Object,
    },
});

const { action } = toRefs(props);

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

const attachmentsLabel = computed(() => {
    const commentsAttachments = action.value.comments.reduce((sum, comment) => {
        return sum + (comment.attachments ? comment.attachments.length : 0);
    }, 0);

    return commentsAttachments > 1
        ? `${commentsAttachments} Documents partagés`
        : commentsAttachments === 0
        ? null
        : `${commentsAttachments} Document partagé`;
});
</script>

<style scoped lang="scss">
.cardGridTemplateColumnsLarge {
    grid-template-columns: 222px 208px auto 300px 200px;
}
.cardGridTemplateColumnsSmall {
    grid-template-columns: 111px 104px auto 200px 150px;
}
</style>
