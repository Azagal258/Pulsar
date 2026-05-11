<script setup lang="ts">
import { ref, watch } from "vue"
import { useDebounceFn } from "@vueuse/core";
import { useRoute } from "vue-router"
import type { User } from "../types/user";
import defaultAvatar from "../assets/profile.webp"

const query = ref("")
const results = ref<User[]>([])
const route = useRoute()

const emit = defineEmits<{
    (e: "results", data: any): void
}>()

// utility functions
function getAvatar(user: User) {
    return (
        user.userProfiles?.[0]?.image?.thumbnail || defaultAvatar
    )
}
// pop in the link
function getUserPage(user: User) {
    return (
        `/user/${user.address.toLowerCase()}`
    )
}

// simple in-memory cache
const cache = new Map<string, any>()

async function fetchResults(q: string) {
    if (cache.has(q)) {
        return cache.get(q)
    }
    // uses backend
    const res = await fetch(`/api/user/search?query=${encodeURIComponent(q)}`)
    const data = await res.json()

    cache.set(q, data)
    return data
}

// avoid to flood the endpoint with requests 
const debouncedSearch = useDebounceFn (async () => {
    // ignore empty requests
    if (!query.value.trim()) {
            results.value = []
            return
        }
        
    const data = await fetchResults(query.value)

    results.value = data.results
    emit("results", data)
}, 1000);

// update value with inputs
watch(query, debouncedSearch)

// reset the bar when navigating
watch(
    () => route.fullPath,
    () => {
        query.value = ""
        results.value = []
    }
)
</script>
<template>
    <div class="search-wrapper">
        <input
            v-model="query"
            placeholder="Search a user..."
            class="search-bar"
        />
        <div v-if="results.length" class="results">
            <div v-for="user in results.slice(0,3)" :key="user.nickname" class="user-card">
                <RouterLink :to="getUserPage(user)" class="fill-div">
                    <img :src="getAvatar(user)" width="30px" alt="avatar"/>
                    <span>
                        {{user.nickname}}
                    </span>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.search-wrapper {
    position: relative;
    width: 200px;
}

.search-bar {
    width: 90%;
    padding: .3rem .5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
}

.results {
    position: absolute;
    top: calc(100%);
    width: 100%;
    z-index: 2;
}

.user-card {
    position: relative;
    border-radius: 6px;
    border: 1px solid grey;
    background-color: black;
    height: 40px;
}

.user-card + .user-card {
    margin-top: -1px;
}

.user-card img{
    position: absolute;
    top: 5px;
    left: 5px;
}

.user-card span {
    position: absolute;
    top: 50%;
    left: 40px;
    transform: translateY(-50%);
}

.fill-div {
    display: block;
    width: 100%;
    height: 100%;
    text-decoration: none;
    border-radius: 6px;
}
</style>