<template>
    <DetailsPanel>
        <template v-slot:title>Intervention</template>
        <template v-slot:body>
            <DetailsPanelSection>
                <p class="font-bold">Champs d'intervention</p>
                <p class="flex">
                    <Tag
                        v-for="topic in plan.topics"
                        :key="topic.uid"
                        :class="['mr-2']"
                        >{{ topic.name }}</Tag
                    >
                </p>
            </DetailsPanelSection>

            <DetailsPanelSection class="flex">
                <aside aria-label="Dates importantes">
                    <Icon icon="calendar" class="mr-2" />
                </aside>
                <section class="grid grid-cols-2">
                    <!-- started at -->
                    <span class="font-bold">Débutée le</span>
                    <span>
                        {{ startedAt }} ({{
                            formatDateSince(plan.started_at / 1000)
                        }})
                    </span>

                    <!-- expected to end at -->
                    <span
                        class="font-bold mt-1"
                        v-if="!closedAt && expectedToEndAt"
                        >Fin prévue le</span
                    >
                    <span class="mt-1" v-if="!closedAt && expectedToEndAt">{{
                        expectedToEndAt
                    }}</span>

                    <!-- closed at -->
                    <span class="font-bold mt-1" v-if="closedAt"
                        >Terminée le</span
                    >
                    <span class="mt-1" v-if="closedAt">{{ closedAt }}</span>
                </section>
            </DetailsPanelSection>

            <DetailsPanelSection class="flex">
                <aside aria-label="Objectifs de l'intervention">
                    <Icon icon="bullseye" class="mr-2" />
                </aside>
                <section>
                    <span class="font-bold">Objectifs de l'intervention</span>
                    <p class="pre-line">{{ plan.goals }}</p>
                </section>
            </DetailsPanelSection>

            <DetailsPanelSection class="flex" v-if="plan.final_comment">
                <aside aria-label="Commentaires">
                    <Icon icon="comment" class="mr-2" />
                </aside>
                <section>
                    <span class="font-bold"
                        >Commentaires suite à la fermeture du dispositif</span
                    >
                    <p class="pre-line">{{ plan.final_comment }}</p>
                </section>
            </DetailsPanelSection>
        </template>
    </DetailsPanel>
</template>

<script>
import DetailsPanel from "#app/components/ui/details/DetailsPanel.vue";
import DetailsPanelSection from "#app/components/ui/details/DetailsPanelSection.vue";
import formatDateSince from "../TownsList/formatDateSince";

export default {
    props: {
        plan: {
            type: Object
        }
    },

    components: {
        DetailsPanel,
        DetailsPanelSection
    },

    methods: {
        formatDateSince
    },

    computed: {
        startedAt() {
            return new Date(this.plan.started_at).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        },
        expectedToEndAt() {
            if (!this.plan.expected_to_end_at) {
                return null;
            }

            return new Date(this.plan.expected_to_end_at).toLocaleDateString(
                "fr-FR",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );
        },
        closedAt() {
            if (!this.plan.closed_at) {
                return null;
            }

            return new Date(this.plan.closed_at).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        }
    }
};
</script>
