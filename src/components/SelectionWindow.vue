<script setup lang="ts">
import { ref } from "vue"

const count = ref<number>(0);
const messages = ref<string[]>([]);

const increment = () => {
    count.value++;
    messages.value.push("I'm trying to display something in here");
};
</script>
<template>
    <div id="modal-window-attempt">
        <div v-for="(msg, index) in messages" :key="index">
            <p>{{ msg }}</p>
        </div>
        <button @click="increment">
            Count is: {{ count }}
        </button>
    </div>
</template>
<style scoped>

#modal-window-attempt {
    position: relative;
    border: 5px solid green;
    background-color: #242424;
    padding: 5px;
}
</style>