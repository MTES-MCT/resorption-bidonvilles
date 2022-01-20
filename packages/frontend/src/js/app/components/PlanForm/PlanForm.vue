<template>
    <ValidationObserver ref="form" @submit.prevent="submit" v-slot="{ errors }">
        <form>
            <div class="bg-G100 py-8">
                <PrivateContainer class="flex justify-between items-baseline">
                    <div class="text-display-lg">{{ submitWording }}</div>
                    <div>
                        <Button variant="primaryText" @click="back"
                            >Annuler</Button
                        >
                        <Button
                            class="ml-5"
                            variant="tertiary"
                            :loading="loading"
                            data-cy-button="submit"
                            >Valider</Button
                        >
                    </div>
                </PrivateContainer>
            </div>

            <PrivateContainer class="flex pt-10">
                <FormLeftColumn class="leftColumnWidth" :sections="sections" />

                <div class="flex-1">
                    <PlanFormPanelInfo></PlanFormPanelInfo>

                    <FormErrorLog
                        id="erreurs"
                        class="mt-8 mb-8"
                        :mainError="mainError"
                        :errors="errors"
                    ></FormErrorLog>

                    <div class="mt-8 text-right italic text-red font-bold">
                        * : Réponses obligatoires
                    </div>
                </div>
            </PrivateContainer>

            <div class="pt-12 pb-16">
                <PrivateContainer class="flex justify-end items-baseline">
                    <Button variant="primaryText" @click="back">Annuler</Button>
                    <Button class="ml-5" variant="tertiary" :loading="loading"
                        >Valider</Button
                    >
                </PrivateContainer>
            </div>
        </form>
    </ValidationObserver>
</template>

<style scoped>
.townPanelShadow {
    box-shadow: 0 0px 20px 0 rgba(0, 0, 0, 0.1), 0 0px 0px 0 rgba(0, 0, 0, 0.06);
    border-radius: 5px;
}
</style>

<script>
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import PlanFormPanelInfo from "./PlanFormPanelInfo";
import FormLeftColumn from "#app/components/ui/Form/FormLeftColumn";
import FormErrorLog from "#app/components/ui/Form/FormErrorLog";
import { notify } from "#helpers/notificationHelper";

export default {
    props: {
        mode: {
            type: String
        },
        data: {
            type: Object,
            default() {
                return {};
            }
        }
    },

    components: {
        PrivateContainer,
        FormLeftColumn,
        FormErrorLog,
        PlanFormPanelInfo
    },

    data() {
        return {
            mainError: null,
            loading: false,
            sections: [
                { id: "characteristics", label: "Intervention" },
                { id: "location", label: "Lieu" },
                { id: "people", label: "Contacts" },
                { id: "financial", label: "Financement" }
            ],
            plan: {}
        };
    },

    computed: {
        submitWording() {
            return this.mode === "create"
                ? "Déclarer un dispositif"
                : "Mettre à jour";
        },

        successNotificationWording() {
            return this.mode === "create"
                ? "La déclaration du dispositif a réussi"
                : "Le dispositif a bien été modifié";
        },

        backPage() {
            if (this.mode === "create") {
                return "/liste-des-dispositifs";
            }

            return `/dispositif/${this.data.id}`;
        }
    },

    methods: {
        back() {
            this.$router.replace(this.backPage);
        },

        async submit() {
            const isValid = await this.$refs.form.validate();
            if (!isValid) {
                this.$router.replace("#top", () =>
                    this.$router.replace("#erreurs")
                );
                return;
            }

            this.loading = true;
            this.mainError = null;
            this.$router.replace("#top");

            try {
                const result = await this.submitFn({});

                this.loading = false;

                let id;
                if (this.mode === "create") {
                    id = result.plan.id;
                } else {
                    id = this.data.id;
                }

                this.$router.push(`/dispositif/${id}`);

                notify({
                    group: "notifications",
                    type: "success",
                    title: "Succès",
                    text: this.successNotificationWording
                });
            } catch (err) {
                this.loading = false;

                if (err && err.fields) {
                    this.$refs.form.setErrors(err.fields);
                }

                this.mainError =
                    (err && err.user_message) ||
                    "Une erreur inconnue est survenue";

                this.$router.replace("#erreurs");
            }
        },

        async submitFn() {
            throw new Error();
        }
    }
};
</script>

<style scoped>
.leftColumnWidth {
    min-width: 300px;
    max-width: 300px;
    @apply pr-10;
}
</style>
