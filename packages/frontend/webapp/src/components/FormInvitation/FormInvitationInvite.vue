<template>
    <div class="relative w-96">
        <DsfrButton
            size="sm"
            tertiary
            no-outline
            icon="fr-icon-delete-line"
            class="absolute top-1 right-1 z-10"
            @click="$emit('remove')"
            >Retirer</DsfrButton
        >
        <DsfrTile
            :title="`${ellipsis(first_name + ' ' + last_name)}`"
            :description="`&#9993; ${ellipsis(email, 22)}`"
            :icon="false"
            horizontal
            :img-src="avatarImg"
            class="pointer-events-none text-wrap"
        />
    </div>
</template>

<script setup>
import avatarImg from "@/assets/img/illustrations/avatar.svg";
import { defineProps, toRefs } from "vue";

const props = defineProps({
    first_name: String,
    last_name: String,
    email: String,
});

const { first_name, last_name, email } = toRefs(props);

const ellipsis = (str, max = 20) =>
    str.length > max ? str.slice(0, max - 1) + "…" : str;
</script>
