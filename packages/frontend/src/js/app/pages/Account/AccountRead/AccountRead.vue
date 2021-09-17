<template>
    <div>
        <AccountHeader
            :title="$route.params.id ? `Compte de l'utilisateur` : 'Mon compte'"
        >
            <Button
                variant="primary"
                @click="$emit('openEdit')"
                icon="pen"
                iconPosition="left"
                >Mettre à jour</Button
            >
        </AccountHeader>
        <PrivateContainer>
            <AccountPanel
                :title="
                    $route.params.id
                        ? 'Coordonnées et identifiants'
                        : 'Mes coordonnées et identifiants'
                "
            >
                <AccountReadLabel label="Structure" class="mb-8">
                    <router-link
                        class="text-primary"
                        :to="'/annuaire/' + user.organization.id"
                    >
                        {{ user.organization.name }}</router-link
                    >
                </AccountReadLabel>
                <AccountReadLabel label="Nom de famille">
                    {{ user.last_name }}
                </AccountReadLabel>
                <AccountReadLabel label="Prénom">
                    {{ user.first_name }}
                </AccountReadLabel>
                <AccountReadLabel label="Fonction">
                    {{ user.position }}
                </AccountReadLabel>
                <AccountReadLabel label="Courriel">
                    {{ user.email }}
                </AccountReadLabel>
                <AccountReadLabel label="Téléphone">
                    {{ user.phone }}
                </AccountReadLabel>

                <div class="mt-8" v-if="!$route.params.id">
                    <div class="font-bold">
                        Vos identifiants de connexion sont votre courriel et
                        votre mot de passe.
                    </div>
                    <div>
                        Si vous souhaitez changer de courriel, écrivez-nous à
                        <a
                            href="mailto:contact@resorption-bodonvilles.beta.gouv.fr"
                            >contact@resorption-bodonvilles.beta.gouv.fr</a
                        >
                    </div>
                    <div>
                        Si vous souhaitez changer votre mot de passe, cliquez
                        sur
                        <span
                            class="link cursor-pointer font-bold"
                            @click="$emit('openEdit')"
                            >modifier votre mot de passe</span
                        >
                    </div>
                </div>
            </AccountPanel>
        </PrivateContainer>
    </div>
</template>

<script>
import AccountPanel from "../ui/AccountPanel";
import AccountHeader from "../ui/AccountHeader";
import AccountReadLabel from "../ui/AccountReadLabel";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";

export default {
    components: {
        PrivateContainer,
        AccountPanel,
        AccountReadLabel,
        AccountHeader
    },
    props: {
        user: {
            type: Object
        }
    }
};
</script>
