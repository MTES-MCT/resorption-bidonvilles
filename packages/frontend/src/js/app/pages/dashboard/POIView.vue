<template>
    <div v-bind:class="{ active }">
        <div class="shadow"></div>

        <simplebar
            class="quickview"
            ref="quickviewPanel"
            data-simplebar-auto-hide="false"
        >
            <header class="quickview-header" v-if="poi">
                <div class="px-4">
                    <div class="text-right">
                        <a href="#" @click="$emit('outside-click')"
                            ><svg class="icon icon-cross">
                                <use xlink:href="#round-cross"></use></svg
                        ></a>
                    </div>
                    <h1 class="quickview-title">
                        Point de distribution alimentaire
                    </h1>
                    <div class="text-G600 uppercase text-sm my-2 ">
                        source: soliguide.fr
                    </div>
                    <h4 class="my-4" v-if="poi.name">
                        {{ poi.name }}
                    </h4>
                    <div v-if="poi.address">
                        {{ poi.address }}
                    </div>
                    <div
                        v-if="poi.description"
                        class="my-2"
                        v-html="poi.description"
                    />
                    <div v-if="poi.entity.phones.length > 0" class="my-2">
                        Tel:
                        <div
                            :key="phone.phoneNumber"
                            v-for="phone in poi.entity.phones"
                        >
                            {{ phone.phoneNumber }}
                        </div>
                    </div>
                    <div v-if="poi.entity.mail" class="my-2">
                        Email: {{ poi.entity.mail }}
                    </div>
                    <div v-if="poi.languages" class="my-2">
                        Langue: {{ poi.languages.join(", ") }}
                    </div>
                    <a
                        v-if="poi.lieu_id"
                        class="my-2"
                        target="_blank"
                        @click="trackOpenSoliguide"
                        :href="'https://soliguide.fr/fiche/' + poi.lieu_id"
                    >
                        Voir plus
                    </a>
                </div>
            </header>
        </simplebar>
    </div>
</template>

<script>
import simplebar from "simplebar-vue";

export default {
    components: {
        simplebar
    },
    props: {
        poi: Object,
        origin: Event // this event is the one that caused that quick-view to appear
    },
    computed: {
        active() {
            return !!this.poi;
        }
    },
    mounted() {
        document.addEventListener("click", this.checkOutsideClick);
    },
    destroyed() {
        document.removeEventListener("click", this.checkOutsideClick);
    },
    watch: {
        active: function(isActive) {
            if (isActive) {
                this.trackOpenPOI();
            }
        }
    },
    methods: {
        trackOpenPOI() {
            this.$trackMatomoEvent("POI", "Open POI", `P${this.poi.lieu_id}`);
        },
        trackOpenSoliguide() {
            this.$trackMatomoEvent(
                "POI",
                "Click See More",
                `P${this.poi.lieu_id}`
            );
        },
        checkOutsideClick(event) {
            if (!this.poi) {
                return;
            }

            // ignore the origin event
            if (event === this.origin) {
                return;
            }

            // if the click was outside ourselves, share the info
            if (!this.$refs.quickviewPanel.$el.contains(event.target)) {
                this.$emit("outside-click", event);
            }
        }
    }
};
</script>

<style scoped lang="scss">
@import "#src/css/v1/config/colors.scss";

.v1 {
    .shadow {
        visibility: hidden;
        z-index: 6000;
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        opacity: 0;
        transition: opacity 0.4s linear;
        -webkit-transition: opacity 0.4s linear;
    }

    .quickview {
        z-index: 7000;
        position: fixed;
        top: 71px;
        bottom: 0;
        right: -300px;
        width: 300px;
        color: $NILE_BLUE;
        transition: right 0.4s ease-in-out;
        -webkit-transition: right 0.4s ease-in-out;
        background: #ffffff;
        border-left: 1px solid #c9d3df;

        .quickview-header {
            padding: 15px 0;
            background: #f4f8fc;

            .quickview-title {
                margin: 0;
                font-weight: normal;
                font-size: 1.3rem;
                letter-spacing: 0.05em;

                > a {
                    color: $NILE_BLUE;
                    text-decoration: none;

                    &:hover {
                        text-decoration: underline;
                    }
                }
            }

            .quickview-subtitle,
            .quickview-name,
            .quickview-time {
                margin: 0;
                font-weight: normal;
                font-size: 0.8rem;
                letter-spacing: 0.05em;
            }
        }
    }

    .active {
        .shadow {
            visibility: visible;
            opacity: 1;
        }

        .quickview {
            right: 0;
        }
    }
}
</style>
