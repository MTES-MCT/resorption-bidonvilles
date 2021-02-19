<template>
    <div class="bg-blue100 p-4 flex">
        <div class="mr-2"><Icon icon="user" /></div>
        <div>
            <p class="font-bold">
                {{ actor.first_name }} {{ actor.last_name.toUpperCase() }}
            </p>
            <p>{{ actor.organization.name }}</p>
            <div v-if="actor.themes.length > 0" class="mt-1">
                <TownDetailsSelfTag
                    v-for="theme in actor.themes"
                    v-bind:key="theme.id"
                >
                    {{ theme.value || themes[theme.id] }}
                </TownDetailsSelfTag>
            </div>
        </div>
    </div>
</template>

<script>
import TownDetailsSelfTag from "./TownDetailsSelfTag.vue";
import { get as getConfig } from "#helpers/api/config";

export default {
    props: {
        actor: {
            type: Object,
            required: false
        }
    },
    data() {
        const { actor_themes: themes } = getConfig();
        return {
            themes
        };
    },
    components: {
        TownDetailsSelfTag
    }
};
</script>
