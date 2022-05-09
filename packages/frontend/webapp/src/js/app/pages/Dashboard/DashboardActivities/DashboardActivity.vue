<template>
    <article
        :class="
            `flex py-4 ${
                !activity.shantytown ? 'items-center' : ''
            } hover:bg-G200 cursor-pointer`
        "
        @click="routeToDetails"
    >
        <aside class="mr-6">
            <span
                :class="
                    `${iconColor.background} ${iconColor.text} text-xl rounded-full inline-flex items-center justify-center w-12 h-12`
                "
                ><Icon :icon="icon"
            /></span>
        </aside>

        <section>
            <h1 class="font-bold text-primary">
                {{ title
                }}<span v-if="subtitle" class="ml-1 font-normal text-G700">{{
                    subtitle
                }}</span>
            </h1>
            <p class="mt-1" v-if="activity.shantytown">
                <span class="font-bold">{{ activity.shantytown.usename }}</span>
                <span class="ml-1 italic"
                    >{{ activity.shantytown.city.name }}
                    <span v-if="showDepartementCode"
                        >({{ activity.shantytown.departement.code }})</span
                    >
                </span>
            </p>
            <ResorptionTargetTag
                v-if="resorptionTarget"
                :target="resorptionTarget"
            />
            <p class="text-G500">{{ formatActivityDate(activity.date) }}</p>
            <!-- eslint-disable prettier/prettier -->
            <blockquote
                v-if="description"
                class="mt-3 border-l-4 border-primary py-1 pl-2 italic whitespace-pre-line"
            >“{{ description }}“</blockquote>
            <!-- eslint-enable prettier/prettier -->
        </section>
    </article>
</template>

<script>
import formatActivityDate from "#app/utils/formatActivityDate";
import showActivityDepartementCode from "#app/mixins/showActivityDepartementCode";
import ResorptionTargetTag from "#app/components/ResorptionTargetTag/ResorptionTargetTag.vue";

export default {
    mixins: [showActivityDepartementCode],

    props: {
        activity: {
            type: Object,
            required: true
        }
    },

    components: {
        ResorptionTargetTag
    },

    data() {
        return {
            colors: {
                green: {
                    background: "bg-green100",
                    text: "text-green500"
                },
                blue: {
                    background: "bg-blue100",
                    text: "text-blue500"
                },
                orange: {
                    background: "bg-orange100",
                    text: "text-orange500"
                },
                red: {
                    background: "bg-error",
                    text: "text-white"
                },
                gray: {
                    background: "bg-G300",
                    text: "text-G800"
                }
            }
        };
    },

    computed: {
        event() {
            return `${this.activity.entity}-${this.activity.action}`;
        },
        title() {
            switch (this.event) {
                case "user-creation": {
                    const { users } = this.activity;
                    const names = users.map(({ name, location }) => {
                        if (
                            !this.showDepartementCode ||
                            !location.departement
                        ) {
                            return name;
                        }

                        return `${name} (${location.departement.code})`;
                    });
                    if (users.length === 1) {
                        return names[0];
                    }

                    return [
                        names.slice(0, names.length - 1).join(", "),
                        "et",
                        names.slice(-1)[0]
                    ].join(" ");
                }

                case "shantytown-creation":
                    return "Nouveau site";

                case "shantytown-closing":
                    if (this.activity.shantytown.closedWithSolutions === true) {
                        return "Site résorbé";
                    }

                    return "Site fermé";

                case "comment-creation": {
                    const title = "Nouveau message";
                    if (this.activity.highCovidComment) {
                        return `${title} COVID-19`;
                    }

                    return title;
                }

                case "electricity-creation":
                    return "Nouvel accès à l'électricité";

                case "electricity-closing":
                    return "Accès à l'électricité perdu";

                case "water-creation":
                    return "Nouvel accès à l'eau";

                case "water-closing":
                    return "Accès à l'eau perdu";

                default:
                    return "Événement inconnu";
            }
        },

        subtitle() {
            switch (this.event) {
                case "user-creation":
                    return `${
                        this.activity.users.length > 1 ? "ont" : "a"
                    } rejoint la plateforme`;

                case "comment-creation":
                    if (this.activity.highCovidComment) {
                        return "";
                    }

                    return "dans le journal du site";

                case "shantytown-creation":
                    return "déclaré";

                case "shantytown-closing":
                    if (this.activity.shantytown.closedWithSolutions !== true) {
                        return "hors résorption";
                    }

                    return "";

                default:
                    return "";
            }
        },

        resorptionTarget() {
            if (this.activity.entity === "shantytown") {
                return this.activity.shantytown.resorptionTarget || null;
            }

            return null;
        },

        description() {
            if (this.activity.entity !== "comment") {
                return null;
            }

            return (this.activity.highCovidComment || this.activity.comment)
                .description;
        },

        icon() {
            if (this.activity.entity === "shantytown") {
                return "map-marker-alt";
            }

            if (this.activity.entity === "user") {
                return "user";
            }

            if (this.activity.entity === "comment") {
                if (
                    (this.activity.comment && this.activity.comment.covid) ||
                    this.activity.highCovidComment
                ) {
                    return "exclamation";
                }

                return "comment";
            }

            if (this.activity.entity === "electricity") {
                return "bolt";
            }

            if (this.activity.entity === "water") {
                return "tint";
            }

            return "question";
        },

        iconColor() {
            switch (this.event) {
                case "user-creation":
                    return this.colors.orange;

                case "comment-creation":
                    if (
                        (this.activity.comment &&
                            this.activity.comment.covid) ||
                        this.activity.highCovidComment
                    ) {
                        return this.colors.red;
                    }

                    return this.colors.blue;

                case "shantytown-creation":
                    return this.colors.blue;

                case "shantytown-closing":
                    if (this.activity.shantytown.closedWithSolutions === true) {
                        return this.colors.green;
                    }

                    return this.colors.gray;

                case "electricity-creation":
                case "water-creation":
                    return this.colors.green;

                default:
                    return this.colors.gray;
            }
        }
    },

    methods: {
        formatActivityDate,
        routeToDetails() {
            this.$trackMatomoEvent("TB", "Visite activité");

            if (this.activity.entity === "comment") {
                if (this.activity.highCovidComment) {
                    return this.$router.push("/covid-19");
                } else {
                    return this.$router.push(
                        `/site/${this.activity.shantytown.id}#message${this.activity.comment.id}`
                    );
                }
            }

            if (this.activity.entity === "user") {
                if (this.activity.users.length === 1) {
                    return this.$router.push(
                        `/annuaire/${this.activity.users[0].organization}`
                    );
                }

                return this.$router.push("/annuaire");
            }

            if (this.activity.shantytown) {
                return this.$router.push(
                    `/site/${this.activity.shantytown.id}`
                );
            }
        }
    }
};
</script>
