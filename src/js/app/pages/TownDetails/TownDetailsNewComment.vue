<template>
    <div>
        <div class="text-display-lg text-corail p-6">
            Écrire un commentaire
        </div>
        <div class="bg-white">
            <TextArea
                info="some info"
                name="someInput"
                placeholder="Votre commentaire"
                class="border border-G200"
            />
            <div class="flex items-center justify-between">
                <Button variant="primaryOutline">Annuler</Button>
                <Button variant="primary">Valider</Button>
            </div>
        </div>
    </div>
</template>
