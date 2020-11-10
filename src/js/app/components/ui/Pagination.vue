<template>
    <div class="flex flex-row items-center">
        <Button
            icon="chevron-left"
            iconPosition="left"
            variant="text"
            @click="onPrevious"
            >Précédent</Button
        >

        <div
            v-if="currentPage > 1"
            class="cursor-pointer w-8 text-center"
            @click="() => onChangePage(1)"
        >
            1
        </div>
        <div
            :class="[
                'h-8 w-8 bg-primary text-white flex justify-center items-center rounded-full',
                currentPage === 1 ? '' : 'ml-4',
                currentPage === nbPages ? '' : 'mr-4'
            ]"
        >
            {{ currentPage }}
        </div>
        <div
            v-if="currentPage !== nbPages"
            @click="() => onChangePage(nbPages)"
            class="cursor-pointer w-8 text-center"
        >
            {{ nbPages }}
        </div>

        <Button
            icon="chevron-right"
            iconPosition="right"
            variant="text"
            @click="onNext"
            >Suivant</Button
        >
    </div>
</template>

<script>
export default {
    props: {
        currentPage: {
            type: Number
        },
        nbPages: {
            type: Number
        },
        onChangePage: {
            type: Function
        }
    },
    methods: {
        onPrevious() {
            this.onChangePage(Math.max(1, this.currentPage - 1));
        },
        onNext() {
            this.onChangePage(Math.min(this.currentPage + 1, this.nbPages));
        }
    }
};
</script>
