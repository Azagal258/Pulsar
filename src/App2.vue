<script setup lang="ts">
import ObjektDisplay from './components/ObjektDisplay.vue';

</script>

<template>
    <div>
        <h1>This is a title</h1>
        <Suspense>
            <ObjektDisplay />
        </Suspense>
    </div>
</template>