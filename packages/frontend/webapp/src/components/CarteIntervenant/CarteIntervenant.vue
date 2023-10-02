<template>
    <article
        class="p-4 flex space-x-2 border hover:border-primary cursor-pointer"
        @click="$router.push(`/structure/${actor.organization.id}`)"
    >
        <Icon class="mt-1" icon="user" />
        <div class="flex-1">
            <h3 class="font-bold">
                {{ actor.first_name }} {{ actor.last_name.toUpperCase() }}
            </h3>
            <p>{{ actor.organization.name }}</p>
            <div v-if="actor.themes.length > 0" class="mt-2">
                <Tag
                    variant="primary"
                    v-for="theme in actor.themes"
                    :key="theme.id"
                >
                    {{ theme.value || themes[theme.id] }}
                </Tag>
            </div>
            <p class="text-right mt-2">
                <Link :to="`/structure/${actor.organization.id}`">
                    <Icon icon="arrow-right" class="mr-1" /> Consulter les
                    coordonnées</Link
                >
            </p>
        </div>
    </article>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { Link, Icon, Tag } from "@resorptionbidonvilles/ui";

const props = defineProps({
    actor: Object,
});
const { actor } = toRefs(props);
const configStore = useConfigStore();

const themes = computed(() => {
    return configStore.config.actor_themes;
});
</script>
