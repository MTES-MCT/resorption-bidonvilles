<template>
    <DetailsPanel>
        <template v-slot:title>Équipe</template>
        <template v-slot:body>
            <RbTable :columns="columns" :data="data" />
        </template>
    </DetailsPanel>
</template>

<script>
import DetailsPanel from "#app/components/ui/details/DetailsPanel.vue";
import RbTable from "#app/components/Table/RbTable.vue";
import { get as getConfig } from "#helpers/api/config";

export default {
    props: {
        plan: {
            type: Object
        }
    },

    components: {
        DetailsPanel,
        RbTable
    },

    data() {
        const { etp_types: etpTypes } = getConfig();

        return {
            etpTypes
        };
    },

    computed: {
        columns() {
            return [
                { id: "label", label: "" },
                ...this.plan.states.map((state, index) => {
                    return {
                        id: index,
                        label: App.formatDate(
                            new Date(state.date).getTime() / 1000,
                            "d B y"
                        )
                    };
                })
            ];
        },
        availableEtpTypes() {
            return this.etpTypes.filter(({ uid }) =>
                this.plan.states.some(({ etp }) =>
                    etp.some(({ type: { uid: u } }) => uid === u)
                )
            );
        },
        data() {
            return this.availableEtpTypes.map(etpType => {
                const row = {
                    label: etpType.name
                };

                return this.plan.states.reduce((acc, state, index) => {
                    return {
                        ...acc,
                        [index]: (
                            state.etp.find(
                                ({ type: { uid } }) => uid === etpType.uid
                            ) || { total: 0 }
                        ).total
                    };
                }, row);
            });
        }
    }
};
</script>
