<template>
    <div class="text-center">
        <h1 class="text-display-xl font-bold text-black">{{ $t("landingPage.hero.title") }}</h1>
        <h2 class="text-secondary text-display-lg font-bold mt-2">
            {{ $t("landingPage.hero.subtitle") }}
        </h2>
        <LandingPageContactForm class="mx-auto mb-6" />

        <div class="flex justify-center items-center my-4 text-display-md">
            <span :class="squareClass">{{ resorptions[index].figure1 }}</span>
            <span :class="[squareClass, 'ml-2']"> {{ resorptions[index].figure2 }}</span>
            <span class="ml-2">{{ $t("landingPage.hero.review") }}</span>
            <span :class="[squareClass, 'ml-2']">{{ resorptions[index].year1 }}</span>
            <span :class="[squareClass, 'ml-2']">{{ resorptions[index].year2 }}</span>
            <span :class="[squareClass, 'ml-2']">{{ resorptions[index].year3 }}</span>
            <span :class="[squareClass, 'ml-2']">{{ resorptions[index].year4 }}</span>
        </div>
        <p class="text-lg font-bold">Au total plus de <span class="underline">3 000</span> personnes relogées</p>
    </div>
</template>

<script setup>
import LandingPageContactForm from "./LandingPageContactForm.vue";

const resorptions = [
    {
        figure1: 1,
        figure2: 8,
        year1: 2,
        year2: 0,
        year3: 1,
        year4: 9,
    },
    {
        figure1: 1,
        figure2: 6,
        year1: 2,
        year2: 0,
        year3: 2,
        year4: 0,
    },
    {
        figure1: 2,
        figure2: 8,
        year1: 2,
        year2: 0,
        year3: 2,
        year4: 1,
    }
]
const index = ref(0)
let squares = null
const framesPerSecond = 0.4;
const squareClass = "px-2 py-3 square"

onMounted(() => {
    squares = document.getElementsByClassName("square");
    animate()
})

function animate() {
    Object.keys(squares).forEach((index) => {
        squares[index].classList.remove('animateSquare');
        void squares[index].offsetWidth; // trigger reflow
        squares[index].classList.add('animateSquare');
    })

    setTimeout(function () {
        requestAnimationFrame(animate);
    }, 1000 / framesPerSecond);
    index.value = (index.value + 1) % resorptions.length
}
</script>

<style scoped>
.square {
    color: white;
    background-color: black;
}

@keyframes rotateAnimation {
    from {
        color: black;
        transform: rotateX(45deg);
    }

    to {
        color: black;
        transform: rotateX(225deg);
    }
}

.animateSquare {
    animation: rotateAnimation 0.5s;
    transform: rotateX(45deg);
}
</style>

