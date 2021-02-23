<template>
    <div class="flex flex-row mt-5">
        <div
            v-for="(guest, index) in guestList"
            v-bind:key="index"
            @deleteGuest="deleteItem"
        >
            <span>
                {{ guest.firstname }} {{ guest.lastname }} {{ guest.email }}
            </span>
        </div>
    </div>
</template>

<script>
//import InvitationCard from "./InvitationCard";
export default {
    name: "InvitationCardStack",
    components: {
        //InvitationCard
    },
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
        delItem: function(index) {
            this.guestList.splice(index, 1);
        }
    }
};
</script>

<style>
.btn-suppr {
    /* position: absolute; */

    padding: 0px !important;
    height: 27px;
    width: 27px;
    top: 10px;
    right: 10px;
}
</style>
