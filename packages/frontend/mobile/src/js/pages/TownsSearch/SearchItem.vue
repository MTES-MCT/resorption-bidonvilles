<template>
    <li
        class="flex justify-between space-x-4 text-sm items-center"
        @click="select"
    >
        <span class="flex-1 leading-4"
            >{{ item.usename }}<br /><span class="text-G400">{{
                item.city.name
            }}</span
            ><br />
            <span class="text-red font-bold" v-if="item.closedAt">
                Fermé depuis {{ formatDateSince(item.closedAt) }}
            </span></span
        >

        <span class="text-primary text-sm"
            ><Icon icon="share-square" class="text-primary" /> Choisir</span
        >
    </li>
</template>

<script>
import formatDateSince from "../TownPage/utils/formatDateSince";

import { Icon } from "@resorptionbidonvilles/ui";

export default {
    components: {
        Icon,
    },
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    methods: {
        formatDateSince,
        select() {
            const listener = this.$store.state.search.listener;
            if (listener) {
                listener(this.item);
                this.$store.commit("search/SET_LISTENER", null);
            }

            this.$router.back();
        },
    },
};
</script>
