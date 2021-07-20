<template>
    <div>
        <router-link
            class="font-bold text-primary underline"
            :to="`/site/${activity.shantytown.id}`"
            >Message publié</router-link
        >
        <span class="text-primary">
            par
            <router-link
                class="hover:underline"
                :to="`/annuaire/${activity.author.organization}`"
                >{{ activity.author.name }},
                {{ activity.author.organization }}</router-link
            >
        </span>
        <span>
            sur le site &laquo; {{ activity.shantytown.usename }},
            {{ activity.shantytown.city }} &raquo;
        </span>
    </div>
</template>

<script>
module.exports = {
    props: {
        activity: {
            type: Object,
            required: true
        }
    }
};
</script>
