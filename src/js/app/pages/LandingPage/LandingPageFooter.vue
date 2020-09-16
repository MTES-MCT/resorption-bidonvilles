<template>
    <footer class="bg-black text-white py-8" role="contentinfo">
        <div class="container mx-auto">
            <div class="container-lg">
                <div class="md:flex flex-row justify-between">
                    <ul>
                        <li><font-awesome-icon icon="envelope"></font-awesome-icon></li>
                        <li><h4>Contactez l’équipe du projet</h4></li>
                        <li><h4><a class="underline" href="mailto:contact@resorption-bidonvilles.beta.gouv.fr">contact@resorption-bidonvilles.beta.gouv.fr</a></h4></li>
                    </ul>

                    <ul class="my-3 md:my-0">
                        <li><a @click="$router.replace('#top', () => $router.replace('#contexte'));">Contexte</a></li>
                        <li><a @click="$router.replace('#top', () => $router.replace('#plateforme'));">La plateforme</a></li>
                        <li><a @click="$router.replace('#top', () => $router.replace('#partenaires'));">Partenaires</a></li>
    <!--                    <li><a href="https://github.com/MTES-MCT/action-bidonvilles" title="Github"><svg class="icon icon-github"><use xlink:href="#github"></use></svg></a></li>-->
                    </ul>

                    <ul>
                        <li><router-link to="/statistiques-publiques">Statistiques</router-link></li>
                        <li><router-link to="/mentions-legales">Mentions légales</router-link></li>
                        <li><router-link to="/typologie-des-acces"><font-awesome-icon icon="file-pdf"></font-awesome-icon> &nbsp;Guide des accès et de l'administrateur</router-link></li>
                        <li><router-link to="/charte-d-engagement"><font-awesome-icon icon="file-pdf"></font-awesome-icon> &nbsp;Charte d'engagement de l'utilisateur</router-link></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
</template>
