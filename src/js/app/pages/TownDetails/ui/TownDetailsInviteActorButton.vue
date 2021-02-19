<template>
    <div class="p-4">
        <span
            class="bg-white inline-block border border-primary text-primary px-3 py-1 rounded-sm cursor-pointer font-bold"
            @click="$emit('showInviteActorModal')"
            ><Icon icon="plus" class="mr-1" /> Inviter un autre
            intervenant</span
        >
    </div>
</template>
