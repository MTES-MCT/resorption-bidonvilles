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

    <!--<article class="flex mb-8 items-center">
        <aside class="mr-6">
            <span
                class="bg-orange100 text-orange500 text-xl rounded-full inline-flex items-center justify-center w-12 h-12"
                ><Icon icon="plus"
            /></span>
        </aside>

        <section>
            <h1 class="font-bold text-primary">
                Antoine Majorin, Lucie Coman, et Etienne Gris
                <span class="font-normal text-G700"
                    >ont rejoint la plateforme</span
                >
            </h1>
        </section>
    </article>

    <article class="flex mb-4">
        <aside class="mr-6">
            <span
                class="bg-blue100 text-blue500 text-xl rounded-full inline-flex items-center justify-center w-12 h-12"
                ><Icon icon="map-pin"
            /></span>
        </aside>

        <section>
            <h1 class="font-bold text-primary">
                Nouveau site
                <span class="font-normal text-G700">déclaré</span>
            </h1>
            <p class="mt-1">
                <span class="font-bold"
                    >230 Chemin Saint Jean du Desert</span
                >
                <span class="ml-1 italic"
                    >Marseille 12e Arrondissement</span
                >
            </p>
        </section>
    </article>

    <article class="flex mb-4">
        <aside class="mr-6">
            <span
                class="bg-G300 text-G800 text-xl rounded-full inline-flex items-center justify-center w-12 h-12"
                ><Icon icon="map-pin"
            /></span>
        </aside>

        <section>
            <h1 class="font-bold text-primary">
                Site fermé
                <span class="font-normal text-G700">hors résorption</span>
            </h1>
            <p class="mt-1">
                <span class="font-bold"
                    >230 Chemin Saint Jean du Desert</span
                >
                <span class="ml-1 italic"
                    >Marseille 12e Arrondissement</span
                >
            </p>
        </section>
    </article>

    <article class="flex mb-4">
        <aside class="mr-6">
            <span
                class="bg-green100 text-green500 text-xl rounded-full inline-flex items-center justify-center w-12 h-12"
                ><Icon icon="map-pin"
            /></span>
        </aside>

        <section>
            <h1 class="font-bold text-primary">
                Site résorbé
            </h1>
            <p class="mt-1">
                <span class="font-bold"
                    >230 Chemin Saint Jean du Desert</span
                >
                <span class="ml-1 italic"
                    >Marseille 12e Arrondissement</span
                >
            </p>
        </section>
    </article>

    <article class="flex mb-4">
        <aside class="mr-6">
            <span
                class="bg-blue100 text-blue500 text-xl rounded-full inline-flex items-center justify-center w-12 h-12"
                ><Icon icon="plus"
            /></span>
        </aside>

        <section>
            <h1 class="font-bold text-primary">
                Nouveau message
                <span class="font-normal text-G700"
                    >dans le journal du site</span
                >
            </h1>
            <p class="mt-1">
                <span class="font-bold"
                    >230 Chemin Saint Jean du Desert</span
                >
                <span class="ml-1 italic"
                    >Marseille 12e Arrondissement</span
                >
            </p>
            <blockquote
                class="mt-3 border-l-4 border-primary py-1 pl-2 italic"
            >
                “Toujours pas de nouvelles de l'installation électrique,
                l'installation est insalubre“
            </blockquote>
        </section>
    </article>-->
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
                case "user-creation":
                    return this.activity.user.name;

                case "shantytown-creation":
                    return "Nouveau site";

                case "shantytown-update":
                    return "Site mis à jour";

                case "shantytown-closing":
                    // @todo
                    if (false) {
                        return "Site résorbé";
                    }

                    return "Site fermé";

                case "comment-creation":
                    return "Nouveau message";

                default:
                    return "Événement inconnu";
            }
        },

        subtitle() {
            switch (this.event) {
                case "user-creation":
                    return "a rejoint la plateforme";

                case "comment-creation":
                    return "dans le journal du site";

                case "shantytown-creation":
                    return "déclaré";

                case "shantytown-closing":
                    // @todo
                    if (!false) {
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
                return "plus";
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
                    // @todo
                    if (false) {
                        return this.colors.green;
                    }

                    return this.colors.gray;

                default:
                    return this.colors.gray;
            }
        }
    }
};
</script>
