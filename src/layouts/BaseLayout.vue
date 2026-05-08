<script setup lang="ts">
import { ref } from "vue"
import SearchOverlay from "../components/SearchOverlay.vue"

const searchResults = ref<any[]>([])

function updateResults(data: any) {
    searchResults.value = data
}

</script>

<template>
    <nav>
        <div id="menu">
            <div id="left-side">
                <RouterLink :to="`/`" class="title-link">
                <div id="title">
                    <h1 class="trispace">PULSAR</h1>
                </div>
                </RouterLink>
                <div id="buttons">
                    <RouterLink :to="`/info/objekts`">
                        <button>Objekts infos</button>
                    </RouterLink>
                    <RouterLink :to="`/info/triples`">
                        <button>tripleS profiles</button>
                    </RouterLink>
                    <RouterLink :to="`/info/artms`">
                        <button>ARTMS profiles</button>
                    </RouterLink>
                </div>
            </div>
            <div id="search-bar">
                <SearchOverlay @results="updateResults" />
            </div>
        </div>
    </nav>
    <RouterView v-slot="{ Component }">
        <component 
            :is="Component"
        />
    </RouterView>
</template>
<style scoped>
#search-bar {
  text-align: right;
}

nav {
    border-bottom: #ccc solid 1px;
}

#left-side {
    display: flex;
    align-items: center;
    gap: 2rem;
}

#menu {
    width: calc(100% - 3rem);
    min-height: 50px;
    margin-inline: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;   
}

#buttons {
    display: flex;
    gap: 1rem;
}

button {
    padding: .25rem .5rem;
    border: 1px solid rgb(199, 199, 199);
    border-radius: 6px;
}

button:hover {
    background-color: #525252;
}

.title-link {
    text-decoration: none;
    color: inherit;
}
</style>