<template>
    <div v-bind:class="{ active }">
        <div class="shadow"></div>

        <simplebar
            class="quickview"
            v-bind:class="{
                'quickview--closed': town && town.status !== 'open'
            }"
            ref="quickviewPanel"
            data-simplebar-auto-hide="false"
        >
            <header class="quickview-header" v-if="town">
                <div class="quickview-actions">
                    <Button
                        variant="primaryText"
                        icon="arrow-right"
                        iconPosition="right"
                        @click="showTown"
                        class="text-display-sm hover:underline -mb-1"
                    >
                        Voir la fiche du site
                    </Button>
                </div>

                <div class="text-md px-6">
                    <div class="text-display-md">
                        <span
                            @click="showTown"
                            class="text-primary font-bold hover:underline cursor-pointer"
                        >
                            {{ town.addressSimple }}
                            <span v-if="town.name"> « {{ town.name }} » </span>
                        </span>
                        <span class="text-primary font-normal">
                            {{ town.city.name }}
                        </span>
                    </div>
                </div>
                <div class="text-sm text-G600 pl-6 pt-3">
                    Dernière modification le {{ formatDate(town.updatedAt) }}
                </div>
            </header>

            <section v-for="(section, index) in sections" :key="index">
                <div class="font-bold text-display-sm pb-3">
                    {{ section.title }}
                </div>
                <div
                    class="flex justify-between items-end"
                    v-for="row in section.rows"
                    :key="row.value"
                >
                    <span class="font-bold" v-if="row.label">
                        {{ row.label }} :
                    </span>
                    <span>{{ row.value }}</span>
                </div>
            </section>
        </simplebar>
    </div>
</template>

<script>
import simplebar from "simplebar-vue";
import { hasPermission } from "#helpers/api/config";
import { open } from "#helpers/tabHelper";

export default {
    components: {
        simplebar
    },
    props: {
        town: Object,
        origin: Event // this event is the one that caused that quick-view to appear
    },
    computed: {
        active() {
            return !!this.town;
        },
        caracteristicSection() {
            if (!this.town) {
                return null;
            }

            const rows = [];
            if (this.town.fieldType !== undefined) {
                rows.push({
                    label: "Type de site",
                    value: this.town.fieldType.label
                });
            }
            if (this.town.ownerType !== undefined) {
                rows.push({
                    label: "Type de propriétaire",
                    value: this.town.ownerType.label
                });
            }
            if (this.town.builtAt !== undefined) {
                rows.push({
                    label: "Date d'installation",
                    value: this.town.builtAt
                        ? App.formatDate(this.town.builtAt)
                        : "Inconnue"
                });
            }

            if (rows.length === 0) {
                return null;
            }

            return {
                title: "Caractéristiques",
                rows
            };
        },
        demographySection() {
            if (!this.town) {
                return null;
            }

            const rows = [];
            if (this.town.populationTotal !== undefined) {
                rows.push({
                    label: "Nombre de personnes",
                    value:
                        this.town.populationTotal !== null
                            ? this.town.populationTotal
                            : "inconnu"
                });
            }
            if (this.town.populationCouples !== undefined) {
                rows.push({
                    label: "Nombre de ménages",
                    value:
                        this.town.populationCouples !== null
                            ? this.town.populationCouples
                            : "inconnu"
                });
            }
            if (this.town.populationMinors !== undefined) {
                rows.push({
                    label: "Nombre de mineurs",
                    value:
                        this.town.populationMinors !== null
                            ? this.town.populationMinors
                            : "inconnu"
                });
            }

            if (this.town.minorsInSchool !== undefined) {
                rows.push({
                    label:
                        "Nombre d'enfants inscrits dans un établissement scolaire",
                    value:
                        this.town.minorsInSchool !== null
                            ? this.town.minorsInSchool
                            : "inconnu"
                });
            }

            if (this.town.socialOrigins !== undefined) {
                rows.push({
                    label: "Origines",
                    value: this.town.socialOrigins.length > 0 ? "" : "inconnu"
                });

                this.town.socialOrigins.forEach(socialOrigin => {
                    rows.push({
                        value: socialOrigin.label
                    });
                });
            }

            if (rows.length === 0) {
                return null;
            }

            return {
                title: "Habitants",
                rows
            };
        },
        justiceSection() {
            if (!this.town) {
                return null;
            }

            const rows = [];
            const boolConverter = {
                [true]: "oui",
                [false]: "non"
            };
            if (this.town.justiceProcedure !== undefined) {
                rows.push({
                    label: "Existence d'une procédure judiciaire",
                    value:
                        boolConverter[this.town.justiceProcedure] || "inconnu"
                });
            }
            if (this.town.justiceRendered !== undefined) {
                rows.push({
                    label: "Décision de justice rendue",
                    value: boolConverter[this.town.justiceRendered] || "inconnu"
                });
            }
            if (this.town.policeStatus !== undefined) {
                const converter = {
                    none: "non demandé",
                    requested: "demandé",
                    granted: "obtenu"
                };
                rows.push({
                    label: "Concours de la force publique demandé",
                    value: converter[this.town.policeStatus] || "inconnu"
                });
            }

            if (rows.length === 0) {
                return null;
            }

            return {
                title: "Procédure judiciaire d'expulsion",
                rows
            };
        },
        sections() {
            return [
                this.caracteristicSection,
                this.demographySection,
                this.justiceSection
            ].filter(section => section !== null);
        }
    },
    mounted() {
        document.addEventListener("click", this.checkOutsideClick);
    },
    destroyed() {
        document.removeEventListener("click", this.checkOutsideClick);
    },
    methods: {
        closePanel() {
            this.$emit("outside-click");
        },
        hasPermission,
        formatDate: ts => App.formatDate(ts),
        checkOutsideClick(event) {
            if (!this.town) {
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
        },
        showTown() {
            this.$trackMatomoEvent(
                "Cartographie",
                "Redirection page site",
                `S${this.town.id}`
            );

            const routerData = this.$router.resolve(`/site/${this.town.id}`);
            open(routerData.href);
        }
    },
    watch: {
        town() {
            if (this.town) {
                this.$trackMatomoEvent(
                    "Cartographie",
                    "Click sur site",
                    `S${this.town.id}`
                );
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./TownView.scss";
</style>
