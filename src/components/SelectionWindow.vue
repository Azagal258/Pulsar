<script setup lang="ts">
import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js";
import type { Objekts } from "../types/objekts";
import { ref } from "vue"

const selectedList = defineModel<Objekts>("selectedList", {required: true});
const isDownloading = ref(false);
const toastMessage = ref<string | null>(null);

function showToast(message: string, duration = 3000) {
    toastMessage.value = message;
    setTimeout(() => {
        toastMessage.value = null;
    }, duration);
}

const downloadImagesAsZip = async() => {
    if (!selectedList.value?.length) return;

    isDownloading.value = true;

    try {
        const zipMaker = new ZipWriter(new BlobWriter('application/zip'));

        for (const item of selectedList.value) {
            const blob = await fetch(item.frontImage).then(response => response.blob());
            await zipMaker.add(`${item.slug}.png`, new BlobReader(blob));
        }

        const zipFinal = await zipMaker.close();
        const zipURL = URL.createObjectURL(zipFinal);
        
        //Creates a block to trigger the download and appends it
        //in the DOM to make it consistent across browsers
        const anchorPoint = document.createElement("a");
        anchorPoint.href = zipURL;
        anchorPoint.download = `objekts.zip`;
        document.body.appendChild(anchorPoint);
        anchorPoint.click();
        document.body.removeChild(anchorPoint);
        URL.revokeObjectURL(zipURL);
    } catch (error) {
        console.error("Download failed", error);
        showToast("Download failed, please retry later");
    } finally {
        isDownloading.value = false;
    }
};

</script>
<template>
    <div id="modal-window-attempt">
        <div v-if="toastMessage" class="toast">
            {{ toastMessage }}
        </div>
        <div id="objekt-list">
            <p class="list-header">Selected Objekts:</p>
            <p v-if="selectedList === null">
                Loading
            </p>
            <p v-else-if="!selectedList.length">
                No objekts currently selected
            </p>
            <ul>
                <div class="selected-objekt-line" v-for="objekt in selectedList" :key="objekt.slug">
                    <label class="button-wrapper">
                    <input 
                        type="checkbox"
                        class="button"
                        :value="objekt"
                        v-model="selectedList"
                    />
                    <span class="checkmark"></span>
                </label>
                <span id="objekt-id">{{ objekt.slug }}</span>
                </div>
            </ul>
        </div>
        <div id="download-button">
            <input 
                type="button"
                value="Download"
                @click="downloadImagesAsZip"
                :disabled="isDownloading || !selectedList?.length"
                :class="{ disabled: selectedList.length === 0}"
            />
            <span v-if="isDownloading" class="loader"></span>
        </div>
    </div>
</template>
<style scoped>

.disabled {
    cursor: not-allowed;
}

#modal-window-attempt {
    position: relative;
    border: 2px solid grey;
    background-color: #242424;
    padding: 5px;
    border-radius: 10px;
}

#objekt-list {
    margin-bottom: 0.5rem;
}

#objekt-list .list-header {
    margin-bottom: 0.3rem;
}

#download-button {
    margin-bottom: 0.5rem;
}

.selected-objekt-line {
    margin-bottom: 0.2rem;
}

.selected-objekt-line #objekt-id {
    margin-left: 1.5rem;
}

.button-wrapper {
    position: relative;

    cursor: pointer;
}

.button-wrapper .button {
    opacity: 0;
    width: 0;
    height: 0;
}

.button-wrapper .checkmark{
    position: absolute;
    top: 0;
    left: 0;
    height: .9rem;
    width: .9rem;
    border: 2px solid #9c9c9c;
    border-radius: 5px;
    background-color: #242424;
    transition-duration: 0.5s;
    
}

.button-wrapper .checkmark:hover{
    background-color: rgb(60, 60, 60);
}

.button-wrapper input:checked~ .checkmark{
    background-color: #2196F3;
    border: 2px solid #2196F3;
}

.checkmark:after{
    content: "";
    position: absolute;
    display: none;
}

.button-wrapper input:checked ~ .checkmark:after {
  display: block;
}

.button-wrapper .checkmark::after{
    left: 4px;
    top: 0;
    width: 5px;
    height: 10px;
    border: solid white;
    border-radius: 2px;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.loader {
  top: 5px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  background: linear-gradient(0deg, rgba(255, 61, 0, 0.2) 50%, #ff3d00 100%);
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

.loader::after {
  content: '';  
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #242424;
}

@keyframes rotation {
  0% { transform: rotate(0deg) }
  100% { transform: rotate(360deg)}
} 

.toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #333;
    color: white;
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 14px;
    opacity: 0.95;
}
</style>