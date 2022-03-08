<template>
    <article :class="`flex mb-8 ${!activity.shantytown ? 'items-center' : ''}`">
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
                <span class="ml-1 italic">{{
                    activity.shantytown.city.name
                }}</span>
            </p>
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
export default {
    props: {
        activity: {
            type: Object,
            required: true
        }
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
                    const names = users.map(({ name }) => name);
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

        description() {
            if (this.activity.entity !== "comment") {
                return null;
            }

            return (this.activity.highCovidComment || this.activity.comment)
                .description;
        },

        icon() {
            if (this.activity.entity === "shantytown") {
                return "map-pin";
            }

            if (this.activity.action === "creation") {
                return this.activity.entity === "comment" ? "plus" : "check";
            }

            if (this.activity.closing === "closing") {
                return "times";
            }

            return "check";
        },

        iconColor() {
            switch (this.event) {
                case "user-creation":
                    return this.colors.orange;

                case "comment-creation":
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
    }
};
</script>
