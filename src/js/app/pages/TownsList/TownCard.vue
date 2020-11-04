<template>
    <div class="border-2 hover:border-primary cursor-pointer">
        <div class="p-5 grid grid-cols-5 grid-gap-2 text-sm">
            <div>
                <div>DPT {{ shantytown.departement.code }}</div>
                <div class="text-primary">
                    <div class="text-bold">
                        {{ shantytown.departement.name }}
                    </div>
                    <div>
                        {{ shantytown.city.name }}
                    </div>
                    <div>
                        {{ shantytown.city.usename }}
                    </div>
                </div>
            </div>

            <div>
                <div>
                    <i
                        :style="
                            `background-color: ${shantytown.fieldType.color}`
                        "
                    ></i>
                    <span>{{ shantytown.fieldType.label }}</span>
                </div>
                <div>
                    {{ shantytown.statusName }} depuis<br />le
                    {{ formatDate(shantytown.statusDate, "d/m/y") }}<br />{{
                        shantytown.statusSince
                    }}
                </div>
            </div>

            <div>
                <span
                    v-if="shantytown.populationTotal === null"
                    class="secondary"
                    >Population inconnue</span
                >
                <span v-else>
                    <span class="primary">{{
                        shantytown.populationTotal
                    }}</span>
                    <br />
                    <span class="secondary"
                        >au
                        {{
                            formatDate(
                                shantytown.updatedAt || shantytown.builtAt,
                                "d/m/y"
                            )
                        }}</span
                    >
                </span>
            </div>

            <div>
                <div v-if="shantytown.justiceStatus === null" class="secondary">
                    Aucune procédure judiciaire en cours
                </div>
                <div v-else>
                    <li
                        v-for="status in shantytown.justiceStatuses"
                        :key="status.label"
                    >
                        {{ status.label }}
                        <span v-if="status.date" class="secondary"
                            ><br />le
                            {{ formatDate(status.date, "d/m/y") }}</span
                        >
                    </li>
                </div>
            </div>

            <div>
                <div>Electricité: {{ shantytown.electricityType.value }}</div>
                <div>Accès à l'eau: {{ shantytown.accessToWater }}</div>
                <div>
                    Evacuation des déchets: {{ shantytown.trashEvacuation }}
                </div>
            </div>
        </div>
        <div class="border-t-2 flex justify-between items-center px-3 py-1">
            <div class="text-sm">
                Mis à jour le {{ formatDate(shantytown.updatedAt, "d/m/y") }}
            </div>
            <Button variant="primaryText" icon="arrow-right"
                >Voir la fiche du site</Button
            >
        </div>
    </div>
</template>

<script>
export default {
    props: {
        shantytown: {
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
    }
};
</script>
