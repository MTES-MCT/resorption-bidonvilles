<template>
    <div class="text-center">
        <h1 class="text-display-xl font-bold text-black">{{ $t("landingPage.hero.title") }}</h1>
        <h2 class="text-secondary text-display-lg font-bold mt-2">
            {{ $t("landingPage.hero.subtitle") }}
        </h2>
        <LandingPageContactForm class="mx-auto mb-6" />

        <div class="flex justify-center items-center my-4 text-display-md">
            <span :class="squareClass" data-animation="3">{{ resorptions[index].figure1 }}</span>
            <span :class="[squareClass, 'ml-2']" data-animation="2"> {{ resorptions[index].figure2 }}</span>
            <span class="ml-2">{{ $t("landingPage.hero.review") }}</span>
            <span :class="[squareClass, 'ml-2']" data-animation="2">{{ resorptions[index].year1 }}</span>
            <span :class="[squareClass, 'ml-2']" data-animation="1">{{ resorptions[index].year2 }}</span>
            <span :class="[squareClass, 'ml-2']" data-animation="3">{{ resorptions[index].year3 }}</span>
            <span :class="[squareClass, 'ml-2']" data-animation="2">{{ resorptions[index].year4 }}</span>
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
const framesPerSecond = 0.3;
const squareClass = "px-2 py-3 square"

onMounted(() => {
    squares = document.getElementsByClassName("square");
    animate()
})

function animate() {
    Object.keys(squares).forEach((index) => {
        squares[index].classList.remove("animateSquare1", "animateSquare2", "animateSquare3");
        void squares[index].offsetWidth; // trigger reflow
        squares[index].classList.add(`animateSquare${Math.round(Math.random() * 2 + 1)}`);
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

@keyframes rotateAnimation1 {
    from {
        color: black;
        transform: rotateX(0deg);
    }

    to {
        color: black;
        transform: rotateX(180deg);
    }
}

@keyframes rotateAnimation2 {
    from {
        color: black;
        transform: rotateX(0deg);
    }

    to {
        color: black;
        transform: rotateX(360deg);
    }
}

@keyframes rotateAnimation3 {
    from {
        color: black;
        transform: rotateX(0deg);
    }

    to {
        color: black;
        transform: rotateX(540deg);
    }
}

.animateSquare1 {
    animation: rotateAnimation1 0.5s;
    transform: rotateX(0deg);
}

.animateSquare2 {
    animation: rotateAnimation2 1s;
    transform: rotateX(0deg);
}

.animateSquare3 {
    animation: rotateAnimation3 1.5s;
    transform: rotateX(0deg);
}
</style>

