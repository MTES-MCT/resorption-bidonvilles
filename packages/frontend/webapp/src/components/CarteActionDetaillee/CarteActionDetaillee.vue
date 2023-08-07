<template>
    <div
        :class="[
            'rounded-sm cursor-pointer border-1 border-cardBorder',
            isHover ? 'bg-blue200 border-transparent' : '',
        ]"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
    >
        <RouterLink
            :to="`/action/${action.id}`"
            class="focus:outline-2 outline-info outline-offset-2"
        >
            <div class="-mt-1">
                <div class="mb-4 px-6">
                    <Tag
                        :class="[
                            'text-xs uppercase text-primary',
                            isHover ? 'shadow-md' : '',
                        ]"
                    >
                        <span v-if="action.ended_at"
                            >du
                            {{ formatDate(action.started_at / 1000, "d/m/y") }}
                            au
                            {{
                                formatDate(action.ended_at / 1000, "d/m/y")
                            }}</span
                        >
                        <span v-else>
                            depuis le
                            {{ formatDate(action.started_at / 1000, "d/m/y") }}
                        </span>
                    </Tag>
                </div>

                <div class="text-md px-6">
                    <div class="text-display-md">
                        <span class="font-bold">
                            {{ action.name }}
                        </span>
                    </div>
                </div>

                <div class="md:grid cardGridTemplateColumns gap-10 px-6 py-4">
                    <CarteActionColonneChampsIntervention
                        :topics="action.topics"
                    />
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
                    <div>
                        <Link :to="`/action/${action.id}`">
                            <Icon icon="arrow-right" /> Voir la fiche de
                            l'action
                        </Link>
                    </div>
                </div>
            </div>
        </RouterLink>
    </div>
</template>

<script setup>
import { toRefs, ref } from "vue";
import formatDate from "@common/utils/formatDate";

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
</script>

<style scoped lang="scss">
.cardGridTemplateColumns {
    grid-template-columns: 222px 208px auto 300px 200px;
}
</style>
