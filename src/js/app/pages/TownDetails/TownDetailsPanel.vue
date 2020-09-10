<template>
    <div>
        <div class="panel">
            <div class="panel__header">
                <h3>1. Situation du site</h3>
            </div>
            <div class="form__group">
                <p v-if="town.priority">
                    <strong>Niveau de priorité du site :</strong> {{ town.priority }}
                </p>
                <p v-if="town.builtAt !== undefined">
                    <strong>Date d'installation du site :</strong> {{ town.builtAt !== null ? formatDate(town.builtAt) : 'Inconnue' }}
                </p>
                <p v-if="town.declaredAt !== undefined">
                    <strong>Date de signalement du site :</strong> {{ town.declaredAt !== null ? formatDate(town.declaredAt) : 'Inconnue' }}
                </p>
                <p v-if="town.status !== 'open' && town.closedAt !== undefined">
                    <strong>Date de disparition du site :</strong> {{ town.closedAt !== null ? formatDate(town.closedAt) : 'Inconnue'}}
                </p>
                <p v-if="town.status !== 'open'">
                    <strong>Cause de la disparition :</strong> {{ statusLabel }}
                </p>
                <p v-if="town.status !== 'open' && town.closingSolutions !== undefined">
                    <strong>Orientation des ménages :</strong><span v-if="town.closingSolutions.length === 0"> aucune</span>
                <ul v-if="town.closingSolutions.length > 0">
                    <li v-for="solution in town.closingSolutions">
                        <span>{{ closingSolutions.find(s => s.id === solution.id).label }}</span>
                        <ul>
                            <li v-for="detail in formatSolution(solution)">{{ detail }}</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>

        <div class="panel">
            <div class="panel__header">
                <h3>2. Localisation</h3>
            </div>
            <div class="form__group">
                <p v-if="town.address !== undefined">
                    <strong>Adresse :</strong> {{ town.address }}
                </p>
                <p v-if="town.addressDetails !== undefined">
                    <strong>Informations d'accès :</strong> {{ town.addressDetails }}
                </p>
                <Map :display-searchbar="false" :towns="[ town ]" :default-view="center"></Map>
                <p v-if="town.fieldType !== undefined   ">
                    <strong>Type de site :</strong> {{ town.fieldType.label }}
                </p>
                <p v-if="town.ownerType !== undefined">
                    <strong>Type de propriétaire :</strong> {{ town.ownerType.label }}
                </p>
                <p v-if="town.owner !== undefined">
                    <strong>Propriétaire :</strong> {{ town.owner || 'Inconnu' }}
                </p>
            </div>
        </div>

        <div class="panel">
            <div class="panel__header">
                <h3>3. Habitants</h3>
            </div>
            <div class="form__group">
                <p v-if="town.censusStatus !== undefined">
                    <strong>Statut du diagnostic :</strong> {{ town.censusStatus === 'done' ? 'Réalisé' : (town.censusStatus === 'scheduled' ? 'Prévu' : (town.censusStatus === 'none' ? 'Non prévu' : 'Inconnu')) }}
                </p>
                <p v-if="town.censusConductedAt !== undefined">
                    <strong>Date du diagnostic :</strong> {{ town.censusConductedAt !== null ? formatDate(town.censusConductedAt) : 'Inconnue' }}
                </p>
                <p v-if="town.censusConductedBy !== undefined">
                    <strong>Opérateur en charge du diagnostic :</strong> {{ town.censusConductedBy || 'Inconnu' }}
                </p>
                <p v-if="town.populationTotal !== undefined">
                    <strong>Nombre de personnes :</strong> {{ town.populationTotal !== null ? town.populationTotal : 'inconnu' }}
                </p>
                <p v-if="town.populationCouples !== undefined">
                    <strong>Nombre de ménages :</strong> {{ town.populationCouples !== null ? town.populationCouples : 'inconnu' }}
                </p>
                <p v-if="town.populationMinors !== undefined">
                    <strong>Nombre de mineurs :</strong> {{ town.populationMinors !== null ? town.populationMinors : 'inconnu' }}
                </p>
                <p v-if="town.socialOrigins !== undefined">
                    <strong>Origines :</strong>
                <ul v-if="town.socialOrigins.length > 0">
                    <li v-for="origin in town.socialOrigins">{{ origin.label }}</li>
                </ul>
                <span v-else>inconnues</span>
            </div>
        </div>

        <div class="panel">
            <div class="panel__header">
                <h3>4. Conditions de vie</h3>
            </div>
            <div class="form__group">
                <p>
                    <strong>Accès à l'électricité:</strong> {{ town.electricityType.label }}
                </p>
                <p>
                    <strong>Modalités d'accès à l'électricité :</strong> {{ town.electricityComments }}
                </p>
                <p v-if="town.accessToWater !== undefined">
                    <strong>Accès à l'eau :</strong> {{ town.accessToWater !== null ? (town.accessToWater ? 'oui' : 'non') : 'inconnu' }}
                </p>
                <p v-if="town.accessToWater === true">
                    <strong>Modalités d'accès à l'eau :</strong> {{ town.waterComments }}
                </p>
                <p v-if="town.trashEvacuation !== undefined">
                    <strong>Évacuation des déchets :</strong> {{ town.trashEvacuation !== null ? (town.trashEvacuation ? 'oui' : 'non') : 'inconnu' }}
                </p>
            </div>
        </div>

        <div class="panel" v-if="hasPermission('shantytown.list.data_justice', town)">
            <div class="panel__header">
                <h3>5. Procédure judiciaire d’expulsion des occupants</h3>
            </div>
            <div class="form__group">
                <p v-if="town.ownerComplaint !== undefined">
                    <strong>Dépôt de plainte par le propriétaire :</strong> {{ town.ownerComplaint === null ? 'Inconnu' : (town.ownerComplaint ? 'Oui' : 'Non') }}
                </p>
                <p v-if="town.ownerComplaint && town.justiceProcedure !== undefined">
                    <strong>Existence d’une procédure judiciaire :</strong> {{ town.justiceProcedure === null ? 'Inconnu' : (town.justiceProcedure ? 'Oui' : 'Non') }}
                </p>
                <p v-if="town.justiceProcedure && town.justiceRendered !== undefined">
                    <strong>Décision de justice rendue :</strong> {{ town.justiceRendered === null ? 'Inconnu' : (town.justiceRendered ? 'Oui' : 'Non') }}
                </p>
                <p v-if="town.justiceRendered && town.justiceRenderedBy !== undefined">
                    <strong>Origine de la décision :</strong> {{ town.justiceRenderedBy || 'Inconnue' }}
                </p>
                <p v-if="town.justiceRendered && town.justiceRenderedAt !== undefined">
                    <strong>Date de la décision :</strong> {{ town.justiceRenderedAt !== null ? formatDate(town.justiceRenderedAt) : 'Inconnue' }}
                </p>
                <p v-if="town.justiceRendered && town.justiceChallenged !== undefined">
                    <strong>Contentieux relatif à la décision de justice :</strong> {{ town.justiceChallenged === null ? 'Inconnu' : (town.justiceChallenged ? 'Oui' : 'Non') }}
                </p>
                <p v-if="town.policeStatus !== undefined">
                    <strong>Concours de la force publique :</strong> {{ town.policeStatus === 'granted' ? 'Obtenu' : (town.policeStatus === 'requested' ? 'Demandé' : 'Inconnu') }}
                </p>
                <p v-if="town.policeRequestedAt !== undefined">
                    <strong>Date de la demande du CFP :</strong> {{ town.policeRequestedAt !== null ? formatDate(town.policeRequestedAt) : 'Inconnue' }}
                </p>
                <p v-if="town.policeGrantedAt !== undefined">
                    <strong>Date d'octroi du CFP :</strong> {{ town.policeGrantedAt !== null ? formatDate(town.policeGrantedAt) : 'Inconnue' }}
                </p>
                <p v-if="town.bailiff !== undefined">
                    <strong>Nom de l'étude d'huissiers :</strong> {{ town.bailiff || 'Inconnues' }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import {hasPermission} from "#helpers/api/config";
    import Map from '#app/components/map/map.vue';
    export default {
        props: {
            town: {
                type: Object,
                required: true
            }
        },
        components: {
            Map
        },
        computed: {
            center() {
                return {
                    center: [this.town.latitude, this.town.longitude],
                    zoom: 15,
                };
            },
        },
        methods: {
            formatSolution(solution) {
                const details = [];
                if (solution.householdsAffected !== null) {
                    const plural = solution.householdsAffected > 1 ? 's' : '';
                    details.push(`${solution.householdsAffected} ménage${plural} concerné${plural}`);
                }

                if (solution.peopleAffected !== null) {
                    const plural = solution.peopleAffected > 1 ? 's' : '';
                    details.push(`${solution.peopleAffected} personne${plural} concernée${plural}`);
                }

                if (details.length > 0) {
                    return details;
                }

                return ['aucun détail sur le nombre de ménages/personnes concernés'];
            },
            formatDate: (...args) => App.formatDate(...args),
            hasPermission: permissionName => hasPermission(permissionName),
        }
    }
</script>
