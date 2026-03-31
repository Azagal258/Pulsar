<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import type { Objekts } from "../types/objekts"; 
import ObjektDisplay from './ObjektDisplay.vue';
import FilterBar from "./FilterBar.vue";
import SelectionWindow from "./SelectionWindow.vue";
import SearchOverlay from "./SearchOverlay.vue";

const route = useRoute()
const address = computed(() => route.params.address as string)

const props = defineProps<{address : string}>()
const objektClass = ref<string | undefined>(undefined);
const objektSeason = ref<string | undefined>(undefined);
const group = ref<string | undefined>(undefined);
const artist = ref<string | undefined>(undefined);
const selectedList = ref<Objekts>([]);

const searchResults = ref<any[]>([])

function updateResults(data: any) {
  searchResults.value = data
  console.log(searchResults.value)
}
</script>

<template>
  <RouterLink to="/about">Go to About</RouterLink>
  <div id="search-bar">
    <SearchOverlay @results="updateResults"/>
  </div>
  <div id="filters">
    <FilterBar
      v-model:objekt-class="objektClass"
      v-model:objekt-season="objektSeason"
      v-model:group="group"
      v-model:artist="artist"
    />
  </div>
  <div id="display">
    <Suspense>
      <ObjektDisplay 
        v-model:selected-list="selectedList"
        :objekt-class= "objektClass"
        :objekt-season= "objektSeason"
        :objekt-group= "group"
        :objekt-artist= "artist"
        mode="user-collections"
        :owner="address"
      />
    </Suspense>
    <div id="selection-window">
      <SelectionWindow
      v-model:selected-list="selectedList"
      />
    </div>
  </div>
</template>

<style scoped>

#search-bar {
  z-index: 2;
  position: absolute;
  top: 10px;
  right: 10px;
}

#filters {
  margin: 1.5rem;
}

#display {
  margin: 0 1.5rem
}

#selection-window {
  z-index: 1;
  position: fixed;
  bottom: 10px;
  max-width: 32rem;
  left: 1rem;
  right: 1rem;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width : 950px) {
  #filters {
    margin: 1rem;
  }

  #display {
    margin: 0 1rem
  }
}
</style>