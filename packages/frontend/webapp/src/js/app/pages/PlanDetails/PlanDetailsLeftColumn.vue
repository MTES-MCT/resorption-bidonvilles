<template>
    <div>
        <div class="sticky stickyColumn">
            <div class="font-bold">Rubriques</div>
            <LeftColumnNavLink
                v-for="section in sections"
                :key="section.id"
                :to="`#${section.id}`"
                :activeSection="activeSection === section.id"
                >{{ section.label }}</LeftColumnNavLink
            >
            <router-link
                to="#comment"
                @click.native="scrollFix('#comment')"
                class="text-secondary"
            >
                <div class="flex text-green font-bold mt-4 cursor-pointer">
                    <Icon icon="comment" />
                    <div class="ml-2">
                        <div>Le journal de l'action</div>
                        <div>
                            {{ plan.comments.length }} message{{
                                plan.comments.length > 1 ? "s" : ""
                            }}
                        </div>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script>
import LeftColumnNavLink from "#app/pages/TownDetails/ui/LeftColumnNavLink";

export default {
    props: {
        plan: {
            type: Object,
            required: true
        }
    },

    components: {
        LeftColumnNavLink
    },

    data() {
        const sections = [
            { id: "characteristics", label: "Intervention" },
            { id: "location", label: "Lieu" },
            {
                id: "people",
                label: "Contacts"
            },
            { id: "financial", label: "Financements" }
        ];

        if (this.plan.states.length > 0) {
            sections.push(
                ...[
                    { id: "team", label: "Équipe" },
                    { id: "audience", label: "Public" },
                    {
                        id: "droits_communs",
                        label: "Droits communs et ressources"
                    }
                ]
            );

            const topics = this.plan.topics.map(({ uid }) => uid);
            if (topics.includes("health")) {
                sections.push({ id: "sante", label: "Santé" });
            }
            if (topics.includes("school")) {
                sections.push({
                    id: "education",
                    label: "Éducation et scolarisation"
                });
            }
            if (topics.includes("work")) {
                sections.push({ id: "emploi", label: "Formation et emploi" });
            }
            if (topics.includes("housing")) {
                sections.push({ id: "logement", label: "Logement" });
            }
            if (topics.includes("safety")) {
                sections.push({
                    id: "securisation",
                    label: "Stabilisation et sécurisation du site"
                });
            }
        }

        return {
            sections
        };
    }
};
</script>

<style scoped>
.stickyColumn {
    top: 32px;
}
</style>
