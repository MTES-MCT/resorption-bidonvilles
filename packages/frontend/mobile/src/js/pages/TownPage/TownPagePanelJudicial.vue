<template>
    <div class="flex flex-col">
        <TownPageInfo :title="'Dépôt de plainte du propriétaire'">
            {{ boolToStr(town.ownerComplaint) }}
        </TownPageInfo>
        <TownPageInfo :title="'Existence d’une procédure judiciaire'">
            {{ boolToStr(town.justiceProcedure) }}
        </TownPageInfo>
        <TownPageInfo :title="'Décision de justice rendue'">
            {{ justiceRendered }}
        </TownPageInfo>
        <TownPageInfo :title="'contentieux'">
            {{ boolToStr(town.justiceChallenged) }}
        </TownPageInfo>
        <TownPageInfo :title="'Concours de la force publique'">
            {{ policeStatusLabel }}
        </TownPageInfo>
        <TownPageInfo :title="'Nom de l\'étude d\'huissier'">
            {{ town.bailiff || "Non Communiqué" }}
        </TownPageInfo>
    </div>
</template>
<script>
import TownPageInfo from "./TownPageInfo.vue";

export default {
    props: {
        town: {
            type: Object,
            required: true,
        },
    },
    components: {
        TownPageInfo,
    },
    computed: {
        justiceRendered() {
            if (this.town.justiceRendered === null) {
                return "NC";
            }

            return this.town.justiceRendered
                ? `rendue le ${this.formatDate(this.town.justiceRenderedAt)}`
                : "non";
        },
        policeStatusLabel() {
            if (this.town.policeStatus === "none") {
                return "Non demandé";
            }

            if (this.town.policeStatus === "requested") {
                return `Demandé le ${this.formatDate(
                    this.town.policeRequestedAt
                )}`;
            }

            if (this.town.policeStatus === "granted") {
                return `Accordé le ${this.formatDate(
                    this.town.policeGrantedAt
                )}`;
            }

            return "NC";
        },
    },
    methods: {
        boolToStr(bool) {
            if (bool === null) {
                return "Non Communiqué";
            }
            return bool ? "oui" : "non";
        },
        formatDate(timestamp) {
            return new Date(timestamp * 1000).toLocaleDateString();
        },
    },
};
</script>
