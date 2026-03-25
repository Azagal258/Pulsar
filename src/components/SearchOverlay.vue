<script setup lang="ts">
import { ref, watch } from "vue"
import type { User } from "../types/user";
import defaultAvatar from "../assets/vue.svg"

const query = ref("")
const results = ref<User[]>([])

const emit = defineEmits<{
  (e: "results", data: any): void
}>()

/* utility functions */
function getAvatar(user: User) {
  return (
    user.userProfiles?.[0]?.image?.thumbnail || defaultAvatar
  )
}

function getUserPage(user: User) {
  return (
    `/user/${user.address.toLowerCase()}`
  )
}

/* avoid to flood the endpoint with requests */
let timer: number | undefined

watch(query, (newValue) => {
  if (timer) clearTimeout(timer)

  timer = window.setTimeout(async () => {
    if (!newValue.trim()) {
      results.value = []
      return
    }

    const data = await fetchResults(newValue)
    results.value = data.results
    emit("results", data)
  }, 1000)
})

/* simple in-memory cache */
const cache = new Map<string, any>()

async function fetchResults(q: string) {
  if (cache.has(q)) {
    return cache.get(q)
  }
  /* there's a special stuff in the config, the base /api sends to apollo.cafe*/
  const res = await fetch(`/api/api/bff/v3/users/search?query=${encodeURIComponent(q)}`)
  const data = await res.json()

  cache.set(q, data)
  return data
}
</script>
<template>
  <input
    v-model="query"
    placeholder="Search a user..."
    class="search-bar"
  />
  <div v-for="user in results.slice(0,3)" :key="user.nickname">
    <div class="user-card">
      <img :src="getAvatar(user)" width="30px" alt="avatar"/>
       <text>
        {{user.nickname}}
      </text>
      <RouterLink :to="getUserPage(user)" class="fill-div"/>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.user-card {
  position: relative;
  top: -1px;
  border-radius: 6px;
  border: 1px solid grey;
  background-color: black;
  height:40px;
}

.user-card img{
  position: absolute;
  top: 5px;
  left: 5px;
}

.user-card text {
  position: absolute;
  top: 25%;
  bottom: 25%;
  left: 40px;
}

.user-card .fill-div {
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
  border-radius: 6px;
}
</style>

