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

</style>