<script setup lang="ts">
import { ref } from "vue"
import ObjektDisplay from "../components/ObjektDisplay.vue"
import { Objekts } from "../types/objekts";
import ObjektsExplorer from "../components/ObjektsExplorer.vue";
import SelectionWindow from "../components/SelectionWindow.vue";

defineProps<{
    address: string
}>()

const selectedList = ref<Objekts>([]);

</script>

<template>
    <ObjektsExplorer v-slot="filters">
        <ObjektDisplay
            v-model:selected-list="selectedList"
            :objekt-class="filters.objektClass"
            :objekt-season="filters.objektSeason"
            :objekt-group="filters.group"
            :objekt-artist="filters.artist"
            display-mode="user-collections"
            :owner="address"
        />
    </ObjektsExplorer>
    <div id="selection-window">
        <SelectionWindow v-model:selected-list="selectedList" />
    </div>

</template>
<style scoped>
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
</style>