<template>
    <article class="flex flex-col border p-3">
        <header class="text-primary text-lg">Action « {{ plan.name }} »</header>
        <p class="mt-2">
            <span class="font-bold">Thématiques</span><br />
            <Tag
                v-for="(topic, index) in plan.topics"
                :key="index"
                variant="primary"
                >{{ topic }}</Tag
            >
        </p>
        <p class="mt-2 flex-1">
            <span class="font-bold">Opérateur de l'action</span><br />
            <LinkOrganization :to="'/structure/' + plan.operator.id">{{
                plan.operator.abbreviation || plan.operator.name
            }}</LinkOrganization>
        </p>

        <p class="text-right mt-3">
            <Link :to="`/action/${plan.plan_id}`">
                <Icon icon="arrow-right" /> Voir les résultats de cette action
            </Link>
        </p>
    </article>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Icon, Link, LinkOrganization, Tag } from "@resorptionbidonvilles/ui";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
</script>
