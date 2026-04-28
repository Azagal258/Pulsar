<script setup lang="ts">
import { ref } from "vue"
import FilterBar from "./FilterBar.vue"

const objektClass = ref<string | undefined>(undefined)
const objektSeason = ref<string | undefined>(undefined)
const group = ref<string | undefined>(undefined)
const artist = ref<string | undefined>(undefined)

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
        <slot
            :objekt-class="objektClass"
            :objekt-season="objektSeason"
            :group="group"
            :artist="artist"
        />
    </div>
</template>
<style scoped>
#filters {
  margin: 1.5rem;
}

#display {
  margin: 0 1.5rem
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