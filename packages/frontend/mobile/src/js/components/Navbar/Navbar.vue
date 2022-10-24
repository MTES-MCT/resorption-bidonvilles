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
import NavbarItem from "./NavbarItem.vue";

export default {
    components: {
        NavbarItem
    },
    methods: {
        async showTownsTab() {
            if (this.$router.currentRoute.value.meta.tab === "sites") {
                if (this.$router.currentRoute.value.path !== "/liste-des-sites") {
                    this.$router.push("/liste-des-sites");
                }

                return;
            }

            this.$router.push(this.$store.state.navigation.sitesTab);
        },
        async showNotesTab() {
            if (this.$router.currentRoute.value.meta.tab === "notes") {
                if (this.$router.currentRoute.value.path !== "/liste-des-notes") {
                    this.$router.push("/liste-des-notes");
                }

                return;
            }

            this.$router.push(this.$store.state.navigation.notesTab);
        },
        signout() {
            this.$router.push("/deconnexion");
        }
    }
};
</script>
