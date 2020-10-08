<template>
    <div class="mt-12 mb-12">
        <ValidationObserver ref="form" v-slot="{ handleSubmit, errors, failed }">
            <form @submit.prevent="handleSubmit" >
                <div class="text-display-xl mb-8">Déclaration d'un site</div>
                <Callout class="mb-12" title="Informations">
                    Ce formulaire vous permet de déclarer un site identifié sur votre territoire (bidonville ou squat). Il est divisé en quatre onglets : caractéristiques, démographie, conditions de vie et procédure judiciaire d'expulsion des occupants. Lorsque le symbole (*) apparaît en rouge au début de l'intitulé de la question, cela signifie qu'il s'agit d'une question obligatoire. Il n'est pas possible de valider le formulaire sans y avoir répondu.
                </Callout>


                <FormGroup title="Caractéristiques">
                    <div>
                        <InputGroup>
                            <TextInput label="Localisation géographique" info="Saisissez ici l'adresse du site, puis précisez sa position en déplaçant le point sur la carte." rules="required" />
                            <TextInput label="Informations d'accès" info="Saisissez ici toutes les informations qui, en plus de l'adresse, peuvent être utiles pour l'accès au site." rules="required" />
                        </InputGroup>
                        <CheckableGroup title="Niveau de priorité du site" info="1 étant le niveau de priorité le plus haut. Le niveau de priorité est un indicateur réservé aux correspondants des services de l’État." rules="required" validationName="Priorité">
                            <Radio checkValue="1" label="1" />
                            <Radio checkValue="2" label="2" />
                            <Radio checkValue="3" label="3" />
                        </CheckableGroup>
                        <InputGroup>
                            <TextInput label="Date d'installation du site" rules="required" />
                            <TextInput label="Date de signalement du site" rules="required" />
                        </InputGroup>
                        <CheckableGroup title="Type de site" rules="required">
                            <Radio checkValue="terrain" label="Terrain" />
                            <Radio checkValue="immeuble" label="Immeuble" />
                            <Radio checkValue="unknown" label="Inconnu" />
                        </CheckableGroup>
                        <CheckableGroup title="Type de propriétaire" rules="required">
                            <Radio checkValue="public" label="Public" />
                            <Radio checkValue="private" label="Privé" />
                            <Radio checkValue="unknown" label="Inconnu" />
                        </CheckableGroup>
                        <CheckableGroup title="Niveau de priorité du site" info="1 étant le niveau de priorité le plus haut. Le niveau de priorité est un indicateur réservé aux correspondants des services de l’État." rules="required">
                            <Radio checkValue="1" label="1" />
                            <Radio checkValue="2" label="2" />
                            <Radio checkValue="3" label="3" />
                        </CheckableGroup>
                    </div>
                </FormGroup>

                <FormGroup title="Habitants">
                    <CheckableGroup title="Statut du diagnostic social" info="Un diagnostic social vise à identifier les situations et besoins des familles et personnes, de repérer le contexte territorial et les acteurs en présence." rules="required">
                        <Radio checkValue="nonprevu" label="Non prévu" />
                        <Radio checkValue="prevu" label="Prévu" />
                        <Radio checkValue="realise" label="Réalisé" />
                        <Radio checkValue="unknown" label="Inconnu" />
                    </CheckableGroup>
                    <TextInput label="Nombre de personnes" info="Laissez ce champ vide si l'information est inconnue" type="number" rules="required"/>
                    <TextInput label="Nombre de ménages" info="Laissez ce champ vide si l'information est inconnue" type="number" rules="required"/>
                    <TextInput label="Nombre de mineurs" info="Laissez ce champ vide si l'information est inconnue" type="number" rules="required"/>
                </FormGroup>
                <Button type="submit">Valider les informations</Button>

            </form>
        </ValidationObserver>

    </div>
</template>
