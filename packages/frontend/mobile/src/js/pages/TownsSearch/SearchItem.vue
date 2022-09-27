<template>
    <li class="flex justify-between space-x-4 text-sm items-center">
        <span class="flex-1 leading-4"
            >{{ item.usename }}<br /><span class="text-G400">{{
                item.city.name
            }}</span></span
        >
        <span class="text-primary text-sm"
            ><Icon icon="share-square" class="text-primary" /> Choisir</span
        >
    </li>
</template>

<script>
import { Icon } from "@resorptionbidonvilles/ui";

export default {
    components: {
        Icon
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    }
};
</script>
