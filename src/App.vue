<script setup lang="ts">
import ObjektDisplay from './components/ObjektDisplay.vue';
import { ref } from "vue";
import FilterBar from "./components/FilterBar.vue";

const objektClass = ref<string | null>(null);
const objektSeason = ref<string | null>(null);
const group = ref<string | null>(null);
const artist = ref<string | null>(null);
</script>

<template>
  <div class="container">
    <FilterBar
      v-model:objekt-class="objektClass"
      v-model:objekt-season="objektSeason"
      v-model:group="group"
      v-model:artist="artist"
    />

    <div>
      <div>Class: {{ objektClass }}</div>
      <div>Season :{{ objektSeason }}</div>
      <div>Group: {{ group }}</div>
      <div>Artist: {{ artist }}</div>
    </div>
  </div>
  <div>
    <Suspense>
      <ObjektDisplay/>
    </Suspense>
  </div>
</template>

<style scoped>
.container {
  margin: 3rem;
}
</style>
