<template>
    <nav class="bg-primary text-white w-full py-4 px-6 ">
        <div class="flex justify-between max-w-lg mx-auto">
            <NavbarItem
                icon="home"
                label="Sites"
                @click.native="showTownsTab"
            />
            <NavbarItem icon="pen" label="Notes" @click.native="showNotesTab" />
            <NavbarItem
                icon="unlink"
                label="Déconnexion"
                @click.native="signout"
            />
        </div>
    </nav>
</template>

<script>
import NavbarItem from "./NavbarItem";
import { mapGetters } from "vuex";

export default {
    components: {
        NavbarItem
    },
    computed: {
        ...mapGetters({
            currentTab: "currentTab",
            townNavigationState: "navigationState"
        })
    },
    methods: {
        async showTownsTab() {
            if (this.currentTab === "towns") {
                return;
            }
            await this.$store.commit("setCurrentTab", "towns");
            this.$router.push(`/${this.townNavigationState}`);
        },
        async showNotesTab() {
            if (this.currentTab === "notes") {
                return;
            }
            await this.$store.commit("setCurrentTab", "notes");
            this.$router.push("/liste-des-notes");
        },
        signout() {
            this.$router.push("/deconnexion");
        }
    }
};
</script>
