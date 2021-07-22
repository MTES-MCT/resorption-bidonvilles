<template>
    <div>
        <p>
            <span class="font-bold">Champ(s) modifié(s) :</span> {{ fieldList }}
        </p>
        <div class="mt-2">
            <Button
                variant="text"
                :icon="toggleIcon"
                iconPosition="left"
                class="text-display-sm hover:underline"
                :padding="false"
                @click="toggle"
                >{{ toggleWording }} le détail des modifications</Button
            >
            <div v-if="showDetails" class="bg-G100 py-4 px-6">
                <div v-for="item in activity.diff" :key="item.fieldKey">
                    <p class="text-info">{{ item.field }}</p>
                    <p>
                        <span class="line-through">
                            {{ item.oldValue || "non renseigné" }}
                        </span>
                        <span>
                            ,
                            {{ item.newValue || "non renseigné" }}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        activity: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            showDetails: false
        };
    },

    computed: {
        fieldList() {
            return this.activity.diff.map(({ field }) => field).join(", ");
        },
        toggleIcon() {
            return this.showDetails ? "chevron-up" : "chevron-down";
        },
        toggleWording() {
            return this.showDetails ? "Masquer" : "Voir";
        }
    },

    methods: {
        toggle() {
            this.showDetails = !this.showDetails;
        }
    }
};
</script>
