<template>
    <div class="rb-table">
        <table class="table">
            <thead>
                <tr>
                    <th>Demandes de logement</th>
                    <th>Ménages</th>
                    <th>Personnes</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>SIAO</th>
                    <td>
                        <input
                            type="number"
                            v-model="data.siao.families"
                            :disabled="disabled"
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            v-model="data.siao.people"
                            :disabled="disabled"
                        />
                    </td>
                </tr>
                <tr>
                    <th>Logement social</th>
                    <td>
                        <input
                            type="number"
                            v-model="data.logement_social.families"
                            :disabled="disabled"
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            v-model="data.logement_social.people"
                            :disabled="disabled"
                        />
                    </td>
                </tr>
                <tr>
                    <th>DALO</th>
                    <td>
                        <input
                            type="number"
                            v-model="data.dalo.families"
                            :disabled="disabled"
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            v-model="data.dalo.people"
                            :disabled="disabled"
                        />
                    </td>
                </tr>
            </tbody>
        </table>

        <table class="table">
            <thead>
                <tr>
                    <th>Accès à un logement ou hébergement</th>
                    <th>Ménages</th>
                    <th>Personnes</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>Logement accompagné / adapté</th>
                    <td>
                        <input
                            type="number"
                            v-model="data.accompagnes.families"
                            :disabled="disabled"
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            v-model="data.accompagnes.people"
                            :disabled="disabled"
                        />
                    </td>
                </tr>
                <tr>
                    <th>
                        Logement sans accompagnement
                        <br />
                        <span>(social ou privé)</span>
                    </th>
                    <td>
                        <input
                            type="number"
                            v-model="data.non_accompagnes.families"
                            :disabled="disabled"
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            v-model="data.non_accompagnes.people"
                            :disabled="disabled"
                        />
                    </td>
                </tr>
                <tr>
                    <th>
                        Hébergement
                        <span
                            >(hors mise à l'abri ou hébergement d'urgence)</span
                        >
                    </th>
                    <td>
                        <input
                            type="number"
                            v-model="data.heberges.families"
                            :disabled="disabled"
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            v-model="data.heberges.people"
                            :disabled="disabled"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Object,
            required: false,
            default() {
                return {
                    siao: {
                        people: "",
                        families: ""
                    },
                    logement_social: {
                        people: "",
                        families: ""
                    },
                    dalo: {
                        people: "",
                        families: ""
                    },
                    accompagnes: {
                        people: "",
                        families: ""
                    },
                    non_accompagnes: {
                        people: "",
                        families: ""
                    },
                    heberges: {
                        people: "",
                        families: ""
                    }
                };
            }
        },

        disabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    data() {
        return {
            data: this.value
        };
    },

    watch: {
        data: {
            handler() {
                this.emitInput();
            },
            deep: true
        }
    },

    mounted() {
        this.emitInput();
    },

    methods: {
        emitInput() {
            this.$emit("input", this.data);
        }
    }
};
</script>

<style lang="scss" scoped>
.v1 {
    .table thead th:not(:first-of-type) {
        text-align: center;
    }

    .table tbody th {
        font-weight: bold;

        > span {
            font-weight: normal;
        }
    }

    .table {
        max-width: 40rem;

        th:first-of-type {
            width: 21rem;
        }
    }

    .table:not(:first-of-type) {
        margin-top: 2rem;
    }
}
</style>
