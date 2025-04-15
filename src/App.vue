<script setup lang="ts">
import { ref } from "vue";
import ObjektDisplay from './components/ObjektDisplay.vue';
import FilterBar from "./components/FilterBar.vue";
import SelectionWindow from "./components/SelectionWindow.vue";

const objektClass = ref<string | undefined>(undefined);
const objektSeason = ref<string | undefined>(undefined);
const group = ref<string | undefined>(undefined);
const artist = ref<string | undefined>(undefined);
</script>

<template>
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
        :objekt-class= "objektClass"
        :objekt-season= "objektSeason"
        :objekt-group= "group"
        :objekt-artist= "artist"
      />
    </Suspense>
    <div id="selection-window">
      <SelectionWindow/>
    </div>
  </div>
</template>

<style scoped>

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