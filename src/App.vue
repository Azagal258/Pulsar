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
  <div class="container">
    <FilterBar
      v-model:objekt-class="objektClass"
      v-model:objekt-season="objektSeason"
      v-model:group="group"
      v-model:artist="artist"
    />
  </div>
  <div class="display">
    <Suspense>
      <ObjektDisplay 
        :objekt-class= "objektClass"
        :objekt-season= "objektSeason"
        :objekt-group= "group"
        :objekt-artist= "artist"
      />
    </Suspense>
  </div>
  <SelectionWindow/>
</template>

<style scoped>
.selection {
  z-index: 10;
}

.container {
  margin: 1.5rem;
}

.display {
  margin: 0 1.5rem
}

@media (max-width : 950px) {
  .container {
    margin: 1rem;
  }

  .display {
    margin: 0 1rem
  }
}
</style>