<script setup lang="ts">

import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import UserDetailsBar from "../components/UserDetailsBar.vue"
import defaultAvatar from "../assets/profile.webp"

defineProps<{
    address: string
}>()

const route = useRoute()
const address = computed(() => route.params.address as string)
const username = ref("")
const profilePic = ref("")

const usernameCache = new Map<string, string>()
const profilePicCache = new Map<string, string>()

async function fetchUsername(addr: string) {
    // Use cache instead of requesting if possible
    if (usernameCache.has(addr)) {
        username.value = usernameCache.get(addr)!
        return
    }

    try {
        // uses backend
        const response = await fetch("/api/user/by-address", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ address: addr })
        })

        const data = await response.json()
        const nickname = data.accounts[0].username

        usernameCache.set(addr, nickname)
        username.value = nickname

    } catch (err) {
        console.error(err)
        username.value = ""
    }
}

async function fetchProfilePicture(usr: string) {
    if (profilePicCache.has(usr)) {
        profilePic.value = profilePicCache.get(usr)!
        return
    }

    try {
        // uses backend
        const res = await fetch(`/api/user/search?query=${encodeURIComponent(usr)}`)
        const data = await (res.json())
        const pp = data.results?.[0]?.userProfiles?.[0]?.image?.original || defaultAvatar

        profilePicCache.set(usr, pp)
        profilePic.value = pp

    } catch (err) {
        console.error(err)
        profilePic.value = ""
    }
}

watch(
    address,
    async (newAddress) => {
        await fetchUsername(newAddress)
        await fetchProfilePicture(username.value)
    },
    { immediate: true }
)

</script>

<template>
    <UserDetailsBar 
        :address="address" 
        :username="username"
        :profile-picture="profilePic"
    />

    <RouterView v-slot="{ Component }">
        <component
            :is="Component"
            :address="address"
        />
    </RouterView>
</template>