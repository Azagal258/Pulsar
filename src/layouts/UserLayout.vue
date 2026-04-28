<script setup lang="ts">

import { computed } from "vue";
import { useRoute } from "vue-router";
import UserDetailsBar from "../components/UserDetailsBar.vue"

defineProps<{
    address: string
}>()

const route = useRoute()
const address = computed(() => route.params.address as string)

</script>

<template>
    <UserDetailsBar :address="address" />

    <RouterView v-slot="{ Component }">
        <component
            :is="Component"
            :address="address"
        />
    </RouterView>
</template>