<template>
    <div class="border-t border-G400 py-4">
        <div class="text-G600 text-sm mb-1">
            {{ formatDate(comment.createdAt, "d M y à h:i") }}
        </div>
        <div class="text-G600 text-sm mb-1">
            Date de l'intervention:
            {{ formatDate(comment.covid.date, "d M y à h:i") }}
        </div>
        <div class="flex flex-wrap">
            <Tag
                v-for="t in tags"
                :key="t.title"
                variant="withoutBackground"
                :class="['inline-block', 'mr-2', 'mb-2', t.bg]"
                >{{ t.title }} {{ t.bg }}</Tag
            >
        </div>

        <div v-if="comment.private" class="font-bold">
            <Icon icon="lock" class="text-red" />
            Message réservé aux membres de la préfecture et DDCS de votre
            territoire.
        </div>
        <div class="text-primary font-bold mb-1">
            <Icon icon="user" /> {{ comment.createdBy.firstName }}
            {{ comment.createdBy.lastName }} -
            {{ comment.createdBy.organization }}
        </div>
        <div class="ml-5">{{ comment.description }}</div>
    </div>
</template>

<script>
export default {
    props: {
        comment: {
            type: Object
        }
    },
    methods: {
        /**
         * @see index.js
         */
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        }
    },
    computed: {
        tags() {
            const covidComment = this.comment.covid;
            const tags = [];

            // TODO: Couleurs à déterminer

            if (covidComment.equipe_maraude) {
                tags.push({
                    bg: "bg-pink-100",
                    title: "Équipe de maraude"
                });
            }

            if (covidComment.equipe_sanitaire) {
                tags.push({
                    bg: "bg-purple-100",
                    title: "Équipe sanitaire"
                });
            }

            if (covidComment.equipe_accompagnement) {
                tags.push({
                    bg: "bg-indigo-100",
                    title: "Équipe d'accompagnement"
                });
            }

            if (covidComment.distribution_alimentaire) {
                tags.push({
                    bg: "bg-blue-100",
                    title: "Distribution d'aide alimentaire"
                });
            }

            if (covidComment.action_mediation_sante) {
                tags.push({
                    bg: "bg-blue-100",
                    title: "Action de médiation en santé"
                });
            }

            if (covidComment.sensibilisation_vaccination) {
                tags.push({
                    bg: "bg-yellow-100",
                    title: "Sensibilisation à la vaccination"
                });
            }

            if (covidComment.equipe_mobile_depistage) {
                tags.push({
                    bg: "bg-red200",
                    title: "Équipe mobile de dépistage"
                });
            }

            if (covidComment.equipe_mobile_vaccination) {
                tags.push({
                    bg: "bg-gray-100",
                    title: "Équipe mobile de vaccination"
                });
            }

            if (covidComment.personnes_orientees) {
                tags.push({
                    bg: "bg-indigo-200",
                    title:
                        "Personne(s) orientée(s) vers un centre d'hébergement"
                });
            }

            if (covidComment.personnes_avec_symptomes) {
                tags.push({
                    bg: "bg-blue-100",
                    title: "Personne(s) avec des symptômes Covid-19"
                });
            }

            if (covidComment.besoin_action) {
                tags.push({
                    bg: "bg-blue-100",
                    title: "Besoin d'une action prioritaire"
                });
            }

            return tags;
        }
    }
};
</script>
