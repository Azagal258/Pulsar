<script setup lang="ts">

    import { ref, watch, onMounted, onUnmounted } from "vue";
    import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js";
    import type { Objekts } from "../types/objekts";
    
    const props = defineProps({
        objektClass : String,
        objektSeason : String,
        objektGroup : String,
        objektArtist : String
    });
    
    const selectedList = defineModel<Objekts>("selectedList", {required: true});

    const objektsList = ref<Objekts>([]);
    const pageSize = 15;
    const offset = ref(0);
    const isFetching = ref(false);

    const loadedImages = ref<Record<string, boolean>>({});
    const removedSkeletons = ref<Record<string, boolean>>({});

    const fetchImages = async (offset: number) => {
        const queryFilters = {
            class_eq: props.objektClass,
            season_eq: props.objektSeason,
            artists_containsAll: props.objektGroup,
            member_eq: props.objektArtist
        };

        const whereClause = Object.entries(queryFilters)
            //remove filters which are set to "All"
            .filter(([_, value]) => value)
            //iterates over the array and format the filters 
            .map(([key, value]) => `${key}: "${value}"`)
            .join(", ");
        
        const objektsQuery = `
            query MyQuery {
                collections(where: { ${whereClause} }, offset: ${offset}, limit: ${pageSize}, orderBy: timestamp_DESC) {
                    id
                    front
                }
            }`;

        const response = await fetch("https://cosmo-api.gillespie.eu/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: objektsQuery,
            })
        }).then(response => response.json());

        return response.data.collections.map(unit => ({
            // reuses the previous data
            ...unit,
            // adds new line, replacing whatever at the end with 2x
            front2x: unit.front.replace(/\/[^/]+$/, "/2x")
        }));
    }
    
    const init = async () => {
        loadedImages.value = {};
        removedSkeletons.value = {};
        offset.value = 0;
        objektsList.value = await fetchImages(offset.value);
        isFetching.value = false;
    };

    const loadNextPage = async () => {
        if (isFetching.value) return;
        isFetching.value = true;

        offset.value += pageSize;
        const newData = await fetchImages(offset.value);
        objektsList.value = [...objektsList.value, ...newData];
        isFetching.value = false;
    };

    const handleScroll = () => {
        if (
            // If scrolled down a certain amount
            window.innerHeight + window.scrollY >= document.body.offsetHeight &&
            // Don't fire if it is empty / initializing
            objektsList.value.length
        ) {
            loadNextPage();
        }
    };

    onMounted(() => {
        window.addEventListener("scroll", handleScroll);
    });

    onUnmounted(() => {
        window.removeEventListener("scroll", handleScroll);
    });

    const transitionSkeleton = (id: string) => {
        loadedImages.value[id] = true;
        setTimeout(() => {
            removedSkeletons.value[id] = true;
        }, 1000);
    }

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
    }

watch(() => [props.objektClass, props.objektSeason, props.objektGroup, props.objektArtist], init);
init();

</script>

<template>
    <div id="objekt-list">
        <p class="list-header">Selected Objekts:</p>
        <p v-if="!selectedList">
            Loading
        </p>
        <p v-else-if="!selectedList.length">
            No objekts currently selected
        </p>
        <ul>
            <li v-for="objekt in selectedList" :key="objekt.id">{{ objekt.id }}</li>
        </ul>
    </div>
    <div id="download-button">
        <input 
            type="button"
            value="Download"
            @click="downloadImagesAsZip"
        />
    </div>
    <div class="container">
        <div v-for="singleObjekt in objektsList">
            <div class="image-wrapper">
                <div 
                    v-if="!removedSkeletons[singleObjekt.id]" 
                    class="skeleton" 
                    :class="{ 'fade-out' : loadedImages[singleObjekt.id]}">
                </div>
                <img
                    class="image"
                    width="100%"
                    :src="singleObjekt.front2x" 
                    :alt="singleObjekt.id" 
                    :class="{ loaded: loadedImages[singleObjekt.id] }" 
                    @load="transitionSkeleton(singleObjekt.id)"
                />
                <label class="button-wrapper">
                    <input 
                        type="checkbox"
                        class="button"
                        :value="singleObjekt"
                        v-model="selectedList"
                    />
                    <span class="checkmark"></span>
                </label>
            </div>
            <div class="display-details">
                {{ singleObjekt.id }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
}

.image-wrapper .skeleton {
    position: absolute;
    width: 100%;
    aspect-ratio: 1083/1674;
    background: linear-gradient(90deg, #eeeeee60 25%, #dddddd60 50%, #eeeeee60 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite linear;
    top: 0;
    left: 0;
    border-radius: 5% / 3.5%;
    transition: opacity 0.7s ease-in-out;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.image-wrapper .skeleton.fade-out {
    opacity: 0;
    transition: opacity 0.7s ease-in-out;
}

.image-wrapper {
    width: 100%;
    aspect-ratio: 1083/1674 ;
}

.image-wrapper .image {
    position: absolute;
    opacity: 0;
    transition: opacity .3s ease-in-out;
}

.image-wrapper .image.loaded {
    opacity: 1;
}

#objekt-list {
    margin-bottom: 1rem;
}

#objekt-list .list-header {
    margin-bottom: 0.5rem;
}

#download-button {
    margin-bottom: 1rem;
}

body {
  padding: 1rem;
}

.image-wrapper .button-wrapper {
    position: absolute;
    top: 10px;
    left: 10px;
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

.image {
    display: block;
    width: 100%;
}

.image-wrapper {
    display: inline-block;
    position: relative;
}

.display-details {
    text-align: center;
}

@media (max-width : 950px) {
    .container{
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width : 600px) {
    .container{
        grid-template-columns: repeat(2, 1fr);
    }
}

</style>
