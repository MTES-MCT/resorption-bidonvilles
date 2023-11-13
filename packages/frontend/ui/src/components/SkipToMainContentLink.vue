<template>
    <div class="bg-G300 p-4 absolute top-0 -translate-y-full focus-within:relative focus-within:translate-y-0">
        <nav role="navigation" aria-label="Accès rapide">
            <ul>
                <li>
                    <Link id="skiplink__contenu" to="#contenu-principal">Aller au
                        contenu
                        principal</Link>
                </li>
            </ul>
        </nav>
    </div>
</template> 

<script setup>
import { Link } from '@resorptionbidonvilles/ui';
</script>