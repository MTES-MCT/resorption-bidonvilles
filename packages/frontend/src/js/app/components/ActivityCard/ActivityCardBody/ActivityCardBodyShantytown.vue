<template>
    <div>
        <router-link
            class="font-bold text-primary underline"
            :to="`/site/${activity.shantytown.id}`"
            ><slot name="title"></slot
        ></router-link>
        <span class="text-primary">
            par
            <router-link
                class="hover:underline"
                :to="`/annuaire/${activity.author.organization}`"
                >{{ activity.author.name }},
                {{ activity.author.organization }}</router-link
            >
        </span>
        <div>
            &laquo; {{ activity.shantytown.usename }},
            {{ activity.shantytown.city }} &raquo;
        </div>
        <slot name="body"></slot>
    </div>
</template>

<script>
export default {
    props: {
        activity: {
            type: Object,
            required: true
        }
    }
};
</script>
