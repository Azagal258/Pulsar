<script setup lang="ts">
import { computed, ref, watch } from "vue"

const props = defineProps<{
    address: string
    username?: string
    profilePicture?: string
}>()

const imageLoaded = ref(false)
const imageError = ref(false)

watch(
    () => props.profilePicture,
    () => {
        imageLoaded.value = false
        imageError.value = false
    }
)

const shortAddress = computed(() => {
    return `${props.address.slice(0, 6)}...${props.address.slice(-4)}`
})
</script>
<template>
    <div id="user-interactions">
        <div id="basic-infos">
            <div class="avatar-wrapper">
                <div v-if="!imageLoaded && !imageError" class="avatar-skeleton"/>
                <img
                    v-show="imageLoaded && !imageError"
                    :src="profilePicture"
                    class="avatar"
                    @load="imageLoaded = true"
                    @error="imageError = true"
                />
                <div v-if="imageError" class="avatar-fallback">?</div>
            </div>
            <span class="trispace nickname">{{ username || shortAddress }}</span>
        </div>
        <div id="buttons">
            <RouterLink :to="`/user/${address}`">
                <button>Collection</button>
            </RouterLink>
            <RouterLink :to="`/user/${address}/trades`">
                <button>Trade history</button>
            </RouterLink>
        </div>
    </div>
</template>
<style scoped>

#user-interactions {
    display: flex;
    gap: 2rem;
    margin-inline: 1.5rem;
    margin-top: .5rem;
}

#basic-infos {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.nickname {
    font-size: x-large;
}

#buttons {
    display: flex;
    gap: 1rem;
    align-items: center;
}

button {
    padding: .25rem .5rem;
    border: 1px solid rgb(199, 199, 199);
    border-radius: 6px;
}

button:hover {
    background-color: #525252;
}

.avatar-wrapper {
    width: 80px;
    height: 80px;
    position: relative;
    overflow: hidden;
    border-radius: 50%;
    background-color: #1f1f1f;
    flex-shrink: 0;
}

.avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

/* hides ugly jpeg corners */
.avatar img {
    border-radius: 50%;
}

.avatar-skeleton {
    width: 100%;
    height: 100%;
    animation: pulse 1.2s infinite;
    background: linear-gradient(
        90deg,
        #2a2a2a 25%,
        #3a3a3a 50%,
        #2a2a2a 75%
    );
    background-size: 200% 100%;
}

.avatar-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    background-color: #2d2d2d;
}

@keyframes pulse {
    from {
        background-position: 200% 0;
    }

    to {
        background-position: -200% 0;
    }
}

</style>
