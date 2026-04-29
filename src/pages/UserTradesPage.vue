<script setup lang="ts">
import ObjektsExplorer from "../components/ObjektsExplorer.vue";
import TradeDisplay from "../components/TradeDisplay.vue"

defineProps<{
    address: string
}>()
</script>
<template>
    <ObjektsExplorer v-slot="filters">
        <TradeDisplay 
            :objekt-class="filters.objektClass"
            :objekt-season="filters.objektSeason"
            :objekt-group="filters.group"
            :objekt-artist="filters.artist"
            :owner="address"
        />
    </ObjektsExplorer>
</template>
<style scoped>
</style>