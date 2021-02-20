<template>
    <div class="bg-blue100 p-4 flex">
        <div class="mr-2"><Icon icon="user" /></div>
        <div class="flex-grow">
            <p class="font-bold">
                {{ actor.first_name }} {{ actor.last_name.toUpperCase() }}
            </p>
            <p>{{ actor.organization.name }}</p>
            <div class="mt-1">
                <TownDetailsSelfTag
                    v-for="theme in actor.themes"
                    v-bind:key="theme.id"
                    :townId="townId"
                    :userId="actor.id"
                    :themeId="theme.id"
                >
                    {{ theme.value || themes[theme.id] }}
                </TownDetailsSelfTag>

                <Tooltip
                    text="Cliquez ici pour modifier vos champs d'intervention"
                    @click.native="$emit('showThemesModal')"
                    ><Button
                        variant="primaryOutlineAlt"
                        icon="plus"
                        size="sm"
                    ></Button>
                </Tooltip>
            </div>
            <div class="w-100 mt-4 text-right">
                <p
                    class="text-primary hover:text-primaryDark focus:outline-none font-bold cursor-pointer"
                >
                    <span v-if="!loading" @click="removeSelf"
                        >Je n'interviens plus sur ce site</span
                    >
                    <Icon v-else icon="spinner" spin />
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import TownDetailsSelfTag from "./TownDetailsSelfTag.vue";
import { get as getConfig } from "#helpers/api/config";
import { notify } from "#helpers/notificationHelper";

export default {
    props: {
        actor: {
            type: Object,
            required: true
        },
        townId: {
            type: Number,
            required: true
        }
    },
    data() {
        const { actor_themes: themes } = getConfig();
        return {
            loading: false,
            themes
        };
    },
    components: {
        TownDetailsSelfTag
    },
    methods: {
        async removeSelf() {
            if (this.loading === true) {
                return;
            }

            this.loading = true;

            try {
                await this.$store.dispatch("removeTownActor", {
                    townId: this.townId,
                    userId: this.actor.id
                });

                notify({
                    group: "notifications",
                    type: "success",
                    title: "Succès",
                    text: "Vous avez été retiré(e) des intervenants "
                });
            } catch (error) {
                notify({
                    group: "notifications",
                    type: "error",
                    title: "Échec",
                    text:
                        (error && error.user_message) ||
                        "Une erreur inconnue est survenue"
                });
            }

            this.loading = false;
        }
    }
};
</script>
