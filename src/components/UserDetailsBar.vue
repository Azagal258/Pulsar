<script setup lang="ts">
    defineProps<{
        address: string
    }>()
</script>
<template>
    <div id="user-interactions">
        <div id="basic-infos">
            <img src="../assets/vue.svg" />
            <span>{{ address }}</span>
        </div>
        <div id="buttons">
            <RouterLink :to="`/user/${address}`">
                <button>Collection</button>
            </RouterLink>
            <RouterLink :to="`/user/${address}/trades`">
                <button>Trade history</button>
            </RouterLink>
            <RouterLink :to="`/`">
                <button>Back to Home</button>
            </RouterLink>
        </div>
    </div>
</template>
<style scoped>

#user-interactions {
    display: flex;
    gap: 1rem;
}

#buttons {
    display: flex;
    gap: 1rem;
    align-items: flex-end;
}

button {
    padding: .25rem .5rem;
    border: 1px solid rgb(199, 199, 199);
    border-radius: 6px;
}

button:hover {
    background-color: #525252;
}

</style>
