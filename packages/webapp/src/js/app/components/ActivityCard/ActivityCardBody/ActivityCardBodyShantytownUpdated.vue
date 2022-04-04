<template>
    <div>
        <p :class="{ '-mt-4': isSmall }">
            <span :class="{ 'font-bold': !isSmall }"
                >Champ(s) modifié(s) :</span
            >
            {{ fieldList }}
        </p>
        <div class="mt-2" v-if="variant !== 'small'">
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
        },
        variant: {
            // voir "ActivityCard.vue"
            type: String,
            required: true
        }
    },

    data() {
        return {
            showDetails: false
        };
    },

    computed: {
        isSmall() {
            return this.variant === "small";
        },
        fieldList() {
            let list = this.activity.diff.map(({ field }) => field);
            if (this.variant === "small" && list.length > 4) {
                list = [...list.slice(0, 4), "..."];
            }

            return list.join(", ");
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
