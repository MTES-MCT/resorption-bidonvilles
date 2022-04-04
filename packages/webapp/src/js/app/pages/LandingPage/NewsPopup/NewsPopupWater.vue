<template>
    <NewsPopup
        :popup="popup"
        v-if="popup.toggleModal"
        v-on:updateToggleModal="updateToggleModal"
    ></NewsPopup>
</template>
<script>
import { get as getCookie, set as setCookie } from "#helpers/cookiesManager";
import NewsPopup from "../../../components/NewsPopup/NewsPopup.vue";
import imageSrc from "./assets/webinaire_acces_a_l_eau.jpg";

export default {
    components: {
        NewsPopup
    },
    data() {
        return {
            popup: {
                toggleModal: false,
                name: "waterAccessWebinar",
                title: "Evènement",
                text: "jeudi 23 septembre de 10h à 12h",
                imageName: imageSrc,
                infoLink:
                    "https://hello.idealco.fr/inscription-formation-dihal-acceseaubidonvilles/",
                joinLink:
                    "https://hello.idealco.fr/inscription-formation-dihal-acceseaubidonvilles/",
                maxDate: "2021-09-23"
            }
        };
    },
    methods: {
        updateToggleModal() {
            this.popup.toggleModal = !this.popup.toggleModal;
        }
    },
    mounted() {
        const eventPopupCookie = getCookie(this.popup.name);
        if (!eventPopupCookie || eventPopupCookie == null) {
            setTimeout(() => {
                this.popup.toggleModal = true;
            }, 5000);
            setCookie(this.popup.name, "true", {
                secure: true
            });
        }
    }
};
</script>
