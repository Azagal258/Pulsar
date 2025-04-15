<script setup lang="ts">
import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js";
import type { Objekts } from "../types/objekts";

const selectedList = defineModel<Objekts>("selectedList", {required: true});

const downloadImagesAsZip = async() => {
        const zipMaker = new ZipWriter(new BlobWriter('application/zip'));

        for (const item of selectedList.value) {
            const blob = await fetch(item.front).then(response => response.blob());
            await zipMaker.add(`${item.id}.png`, new BlobReader(blob));
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
    };

</script>
<template>
    <div id="modal-window-attempt">
        <div id="objekt-list">
            <p class="list-header">Selected Objekts:</p>
            <p v-if="!selectedList">
                Loading
            </p>
            <p v-else-if="!selectedList.length">
                No objekts currently selected
            </p>
            <ul>
                <div class="selected-objekt-line" v-for="objekt in selectedList" :key="objekt.id">
                    <label class="button-wrapper">
                    <input 
                        type="checkbox"
                        class="button"
                        :value="objekt"
                        v-model="selectedList"
                    />
                    <span class="checkmark"></span>
                </label>
                <span id="objekt-id">{{ objekt.id }}</span>
                </div>
            </ul>
        </div>
        <div id="download-button">
            <input 
                type="button"
                value="Download"
                @click="downloadImagesAsZip"
            />
        </div>
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