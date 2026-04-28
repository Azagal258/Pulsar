<script setup lang="ts">
import { ref } from "vue"
import SearchOverlay from "../components/SearchOverlay.vue"

const searchResults = ref<any[]>([])

function updateResults(data: any) {
    searchResults.value = data
}

</script>

<template>
    <div id="search-bar">
        <SearchOverlay @results="updateResults" />
    </div>
    <RouterView v-slot="{ Component }">
        <component 
            :is="Component"
        />
    </RouterView>
</template>
<style scoped>
#search-bar {
  z-index: 2;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>