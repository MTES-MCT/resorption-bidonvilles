<template>
    <PanelInfo class="mt-2 mb-6">
        <template v-slot:title>Règles de modération d'un message</template>
        <template v-slot:content>
            <p class="font-bold mb-4">
                En tant qu'administrateur, vous êtes en charge de la modération
                des messages.
            </p>
            <p class="mb-4">
                Vous pouvez supprimer un message ou demander à son auteur de le
                modifier s'il ne respecte pas les règles suivantes :<br />
                - être neutre et factuel ;<br />
                - ne pas collecter des données personnelles (nom, condamnation
                judiciaire...) de personnes ou groupes, porter une attention
                particulière aux personnes habitant ou issues d'un bidonville
                ;<br />
                - ne doit pas être subjectif, insultant ou inapproprié.
            </p>
            <p>
                Pour plus d'informations :<br />
                <Button
                    variant="primaryText"
                    icon="file-pdf"
                    iconPosition="left"
                    href="/typologie-des-acces"
                    :padding="false"
                    >Guide des accès et de l'administrateur</Button
                ><br />
                <Button
                    variant="primaryText"
                    icon="file-pdf"
                    iconPosition="left"
                    href="/charte-d-engagement"
                    :padding="false"
                    >Charte d'engagement de l'utilisateur</Button
                >
            </p>
        </template>
    </PanelInfo>
</template>
