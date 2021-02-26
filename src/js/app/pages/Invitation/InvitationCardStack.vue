<template>
    <div class="flex flex-col md:flex-wrap md:flex-row mt-2 justify-center">
        <div v-for="(guest, index) in this.guestList" v-bind:key="index">
            <div class="max-w-xl md:mr-1 p-2">
                <div class="shadow-lg">
                    <div
                        class="px-4 py-4 bg-white border-1 border-gray-200 font-bold"
                    >
                        {{ guest.firstname }} {{ guest.lastname }}
                    </div>
                    <div class="p-4 pt-0 bg-white border-b border-gray-200">
                        {{ guest.email }}
                    </div>
                    <div class="p-4 bg-white border-gray-200 text-right">
                        <Button
                            size="sm"
                            variant="secondary"
                            @click="deleteItem(index)"
                            >Supprimer</Button
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "InvitationCardStack",
    data() {
        return {};
    },
    props: {
        guestList: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        }
    },
    methods: {
        deleteItem(index) {
            this.$emit("delete-guest", index);
        }
    }
};
</script>
