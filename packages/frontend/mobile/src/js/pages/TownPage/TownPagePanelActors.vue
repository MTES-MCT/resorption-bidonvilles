<template>
    <div>
        <div v-if="town.actors.length === 0">
            <p class="italic">Aucun intervenant connu sur ce site</p>
        </div>
        <div v-for="actor in town.actors" :key="actor.id">
            <TownPageInfo
                :icon="'user'"
                :title="
                    `${actor.first_name} ${actor.last_name} ${actor.organization.name}`
                "
            >
                <div v-if="actor.themes.length > 0" class="mt-4 text-center">
                    <Tag
                        variant="primary"
                        v-for="theme in actor.themes"
                        :key="theme.id"
                    >
                        {{ theme.value || theme.id }}
                    </Tag>
                </div>
            </TownPageInfo>
        </div>
    </div>
</template>

<script>
import TownPageInfo from "./TownPageInfo.vue";
import { Tag } from "@resorptionbidonvilles/ui";

export default {
    props: {
        town: {
            type: Object
        }
    },
    components: {
        TownPageInfo,
        Tag
    }
};
</script>
