<template>
    <article class="flex flex-col border p-3">
        <header class="text-primary text-lg">
            Action « {{ action.name }} »
        </header>
        <p class="mt-2">
            <span class="font-bold">Thématiques</span><br />
            <Tag
                v-for="topic in action.topics"
                :key="topic.uid"
                variant="primary"
                >{{ topic.name }}</Tag
            >
        </p>
        <p class="mt-2 flex-1">
            <span class="font-bold"
                >Opérateur(s) ou service(s) en charge de l'action</span
            >
            <template v-for="operator in action.operators" :key="operator.id">
                <br />
                <LinkOrganization :to="'/structure/' + operator.id">{{
                    operator.abbreviation || operator.name
                }}</LinkOrganization>
            </template>
        </p>

        <p
            class="text-right mt-3"
            v-if="userStore.hasActionPermission('action.read', action)"
        >
            <Link :to="`/action/${action.id}`">
                <Icon icon="arrow-right" /> Voir les résultats de cette action
            </Link>
        </p>
    </article>
</template>

<script setup>
import { toRefs } from "vue";
import { Icon, Link, LinkOrganization, Tag } from "@resorptionbidonvilles/ui";
import { useUserStore } from "@/stores/user.store";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
const userStore = useUserStore();
</script>
