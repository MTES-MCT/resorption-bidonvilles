<template>
    <article class="border border-G400 flex w-96 hover:border-G500">
        <div class="w-32 h-32 bg-G200 flex items-center justify-center">
            <img :src="avatarImg" class="w-28" alt="invité" />
        </div>
        <div class="flex-1 flex flex-col justify-center px-4 relative">
            <a
                class="absolute right-2 top-2 !text-primary text-sm hover:underline !cursor-pointer"
                @click="$emit('remove')"
                ><Icon icon="fa-regular fa-trash-alt" /> Retirer</a
            >
            <p class="font-bold">{{ first_name }} {{ last_name }}</p>
            <p>{{ email }}</p>
        </div>
    </article>
</template>

<script setup>
import avatarImg from "@/assets/img/illustrations/avatar.svg";
import { defineProps, toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    first_name: String,
    last_name: String,
    email: String,
});

const { first_name, last_name, email } = toRefs(props);
</script>
