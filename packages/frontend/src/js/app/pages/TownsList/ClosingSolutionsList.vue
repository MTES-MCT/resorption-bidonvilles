<template>
    <div>
        <div
            v-for="shantytownClosingSolution in shantytownClosingSolutions"
            :key="shantytownClosingSolution.id"
        >
            <div v-if="showClosingSolutionDetails" class="mb-4">
                <div class="flex items-top customAlign">
                    <Icon icon="home" class="text-lg" />
                    <div class="font-bold ml-2">
                        {{
                            getClosingSolutionLabel(
                                shantytownClosingSolution.id
                            )
                        }}
                    </div>
                </div>
                <div class="ml-8">
                    - {{ shantytownClosingSolution.peopleAffected }} personne{{
                        shantytownClosingSolution.peopleAffected > 1 ? "s" : " "
                    }}
                </div>
                <div
                    v-if="shantytownClosingSolution.householdsAffected !== null"
                >
                    <div class="ml-8">
                        -
                        {{ shantytownClosingSolution.householdsAffected }}
                        ménage{{
                            shantytownClosingSolution.householdsAffected > 1
                                ? "s"
                                : " "
                        }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get as getConfig } from "#helpers/api/config";

export default {
    props: {
        shantytownClosingSolutions: {
            type: Array
        }
    },
    data() {
        const { closing_solutions: closingSolutions } = getConfig();
        return {
            closingSolutions
        };
    },
    methods: {
        getClosingSolutionLabel(id) {
            return this.closingSolutions.find(x => x.id === id).label;
        },
        showClosingSolutionDetails() {
            return (
                this.shantytownClosingSolution.peopleAffected !== null &&
                this.shantytownClosingSolution.householdsAffected !== null
            );
        }
    }
};
</script>
