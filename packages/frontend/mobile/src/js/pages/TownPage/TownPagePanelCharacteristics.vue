<template>
    <div>
        <TownPageInfo :title="'Installé depuis'">
            <div v-if="town.builtAt">
                <div>
                    {{ formatDateSince(town.builtAt) }}
                </div>
            </div>
            <div v-else>
                non communiquée
            </div>
        </TownPageInfo>

        <TownPageInfo :title="'Signalé depuis'">
            <div v-if="town.declaredAt">
                <div>
                    {{ formatDateSince(town.declaredAt) }}
                </div>
            </div>
            <div v-else>
                non communiquée
            </div>
        </TownPageInfo>

        <TownPageInfo :title="'Type de site'">
            <div class="flex items-center">
                <Icon
                    icon="map-marker-alt"
                    class="text-lg mr-2"
                    :style="`color: ${town.fieldType.color}`"
                />
                {{ town.fieldType.label }}
            </div>
        </TownPageInfo>

        <TownPageInfo
            :title="'Informations d\'accès'"
            v-if="town.addressDetails"
        >
            {{ town.addressDetails }}
        </TownPageInfo>
        <TownPageInfo :title="'Coordonnées GPS'">
            Lat {{ town.latitude }}, Long
            {{ town.longitude }}
        </TownPageInfo>
        <TownPageInfo :title="'Propriétaire'">
            {{ town.ownerType.label }}
        </TownPageInfo>
        <TownPageInfo
            :title="'Nom du propriétaire'"
            v-if="
                town.ownerType.label !== 'Inconnu' &&
                    $store.getters['config/hasPermission'](
                        'shantytown_owner.access'
                    )
            "
        >
            {{ town.owner || "non communiqué" }}
        </TownPageInfo>

        <TownPageInfo :title="'S\'agit-il d\'une réinstallation ?'">
            {{ boolToStr(town.isReinstallation) }}
        </TownPageInfo>
    </div>
</template>
<script>
import formatDateSince from "./utils/formatDateSince";
import { Icon } from "@resorptionbidonvilles/ui";
import TownPageInfo from "./TownPageInfo.vue";

export default {
    props: {
        town: {
            type: Object,
            required: true
        }
    },
    components: {
        Icon,
        TownPageInfo
    },
    methods: {
        formatDateSince,
        boolToStr(bool) {
            if (bool === null) {
                return "non communiqué";
            }
            return bool ? "Oui" : "Non";
        }
    }
};
</script>
