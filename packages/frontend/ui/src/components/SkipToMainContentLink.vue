<template>
    <div class="rb-skiplinks">
        <nav role="navigation" aria-label="Accès rapide">
            <ul>
                <li>
                    <a id="skiplink__contenu" href="#main-content" class="rb-link">Aller au contenu
                        principal</a>
                </li>
            </ul>
        </nav>
    </div>
</template> 
<style scoped>
.rb-skiplinks {
    background-color: #e7e7e7;
    padding: 1em;
    position: absolute;
    top: 0;
    transform: translateY(-100%)
}

.rb-skiplinks:focus-within {
    position: relative;
    transform: translateY(0)
}

.rb-link {
    color: #000091;
    font-size: 1rem;
    line-height: 1.5rem;
}

.rb-link:focus {
    outline: none;
}
</style>
