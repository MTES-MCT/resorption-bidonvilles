<template>
    <div class="bg-G300 p-4 absolute top-0 -translate-y-full focus-within:relative focus-within:translate-y-0">
        <ContentWrapper>
            <nav role="navigation" aria-label="Accès rapide">
                <ul>
                    <li>
                        <Link to="#contenu-principal" @click="resetFocus">Aller au
                            contenu
                            principal</Link>
                    </li>
                </ul>
            </nav>
        </ContentWrapper>
    </div>
</template> 

<script setup>
import { nextTick } from 'vue';
import { ContentWrapper, Link } from '@resorptionbidonvilles/ui';

function resetFocus() {
    nextTick(() => {
        document.activeElement.blur();
    });
}
</script>