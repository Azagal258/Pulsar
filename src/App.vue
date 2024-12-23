<script setup lang="ts">
import ObjektDisplay from './components/ObjektDisplay.vue';
import { ref } from "vue";
import FilterBar from "./components/FilterBar.vue";

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

    <!-- <div>
      <div>Class: {{ objektClass }}</div>
      <div>Season :{{ objektSeason }}</div>
      <div>Group: {{ group }}</div>
      <div>Artist: {{ artist }}</div>
    </div> -->
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
</template>

<style scoped>
.container {
  margin: 3rem;
}

.display {
  margin: 0 4rem
}

@media (max-width : 860px) {
  .container {
    margin: 0.8rem;
  }

  .display {
    margin: 0 0.8rem
  }
}
</style>