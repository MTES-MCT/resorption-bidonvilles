<template>
    <div class="text-md px-6">
        <div class="text-primary text-display-md font-bold">
            <RouterLink
                :to="`/site/${shantytown.id}`"
                class="focus:outline-none after:absolute after:inset-0"
                :aria-label="`Fiche site ${shantytown.addressSimple} ${
                    shantytown.name ? shantytown.name : ''
                } ${shantytown.city.name}`"
            >
                <span v-if="shantytown.name" class="font-bold">
                    « {{ shantytown.name }} » - {{ shantytown.addressSimple }}
                    {{ shantytown.city.name }} ({{
                        shantytown.departement.code
                    }})
                </span>
                <span v-else class="font-bold">
                    {{ shantytown.addressSimple }}
                    {{ shantytown.city.name }} ({{
                        shantytown.departement.code
                    }})
                </span>
            </RouterLink>
        </div>
    </div>
    <div class="px-6" v-if="isClosed(shantytown)">
        Fermé le {{ formatDate(shantytown.closedAt, "d/m/y") }}
    </div>
    <div class="px-6" v-else-if="isSolved(shantytown)">
        Résorbé le {{ formatDate(shantytown.closedAt, "d/m/y") }}
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import formatDate from "@common/utils/formatDate.js";
import isSolved from "@/utils/isShantytownResorbed";
import isClosed from "@/utils/isShantytownClosed";

const props = defineProps({
    shantytown: Object,
});
const { shantytown } = toRefs(props);
</script>
