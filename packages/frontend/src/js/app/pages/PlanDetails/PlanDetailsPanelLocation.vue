<template>
    <DetailsPanel>
        <template v-slot:title>Lieu</template>
        <template v-slot:body>
            <DetailsPanelSection class="flex">
                <aside aria-label="Lieu">
                    <Icon icon="map-pin" class="mr-2" />
                </aside>
                <section class="flex-grow">
                    <span class="font-bold">{{
                        plan.location_type.label
                    }}</span>
                    <div v-if="plan.location_type.id === 'location'">
                        <p>{{ plan.location.label }}</p>
                        <Map
                            class="v1"
                            :display-searchbar="false"
                            :displayAddressToggler="false"
                            :displayPrinter="false"
                            :towns="[address]"
                            :default-view="center"
                            :load-territory-layers="false"
                            layer-name="Satellite"
                        />
                    </div>
                    <div
                        v-if="plan.location_type.id === 'shantytowns'"
                        class="grid grid-cols-2 gap-y-2"
                    >
                        <p
                            v-for="shantytown in shantytowns"
                            :key="shantytown.id"
                        >
                            <TownField :fieldType="shantytown.fieldType" />
                            <router-link
                                :to="`/site/${shantytown.id}`"
                                class="link pl-5"
                                >{{ shantytown.usename }}</router-link
                            >
                        </p>
                    </div>
                    <p v-if="plan.location_type.id === 'other'">
                        {{ plan.location_details }}
                    </p>
                </section>
            </DetailsPanelSection>
        </template>
    </DetailsPanel>
</template>

<script>
import DetailsPanel from "#app/components/ui/details/DetailsPanel.vue";
import DetailsPanelSection from "#app/components/ui/details/DetailsPanelSection.vue";
import Map from "#app/components/map/map.vue";
import TownField from "#app/components/TownField/TownField.vue";
import enrichShantytown from "#app/pages/TownsList/enrichShantytown";

export default {
    props: {
        plan: {
            type: Object
        }
    },

    components: {
        DetailsPanel,
        DetailsPanelSection,
        Map,
        TownField
    },

    computed: {
        fieldTypes() {
            return this.$store.state.config.configuration.field_types;
        },
        address() {
            return {
                latitude: this.plan.location.latitude,
                longitude: this.plan.location.longitude,
                address: this.plan.location.label
            };
        },
        center() {
            return {
                center: [
                    this.plan.location.latitude,
                    this.plan.location.longitude
                ],
                zoom: 15
            };
        },
        shantytowns() {
            if (!Array.isArray(this.plan.shantytowns)) {
                return null;
            }

            return this.plan.shantytowns.map(shantytown =>
                enrichShantytown(shantytown, this.fieldTypes)
            );
        }
    }
};
</script>
