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
    
    const objektsList = ref<Objekts>([]);
    const selectedList = ref<Objekts>([]);
    const pageSize = 15;
    const offset = ref(0);

    const isFetching = ref(false);

    const fetchImages = async (offset: number) => {
        const queryFilters = {
            class_eq: props.objektClass,
            season_eq: props.objektSeason,
            artists_containsAll: props.objektGroup,
            member_eq: props.objektArtist
        };

        const whereClause = Object.entries(queryFilters)
            //remove filters set to "All"
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
            // adds new line
            front2x: unit.front.replace(/\/[^/]+$/, "/2x")
        }));
    }
    
    const init = async () => {
        offset.value = 0;
        isFetching.value = false;
        objektsList.value = await fetchImages(offset.value);
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

    const downloadImagesAsZip = async() => {
        const zipMaker = new ZipWriter(new BlobWriter('application/zip'));

        for (const item of selectedList.value) {
            const blob = await fetch(item.front).then(response => response.blob());
            await zipMaker.add(`${item.id}.png`, new BlobReader(blob));
        }

        const zipFinal = await zipMaker.close();
        const zipURL = URL.createObjectURL(zipFinal);

        const anchorPoint = document.createElement("a");
        anchorPoint.href = zipURL;
        anchorPoint.download = `objekts.zip`;
        document.body.appendChild(anchorPoint);
        anchorPoint.click();
        document.body.removeChild(anchorPoint);
        URL.revokeObjectURL(zipURL);
    }

watch(props, init);
init();

</script>

<template>
    <div id="objekt-list">
        <p class="list-header">Selected Objekts list :</p>
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
                <img
                    class="image" 
                    :src="singleObjekt.front2x" 
                    :alt="singleObjekt.id" 
                    width="100%"
                />
                <input 
                    type="checkbox" 
                    class="button"
                    :value="singleObjekt"
                    v-model="selectedList"
                />
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

#objekt-list {
    margin-bottom: 1rem;
}

#objekt-list .list-header {
    margin-bottom: 0.5rem;
}

#download-button {
    margin-bottom: 1rem;
}

@media (max-width : 860px) {
    .container{
        grid-template-columns: repeat(2, 1fr);
    }
}

body {
  padding: 1rem;
}

.image-wrapper .button {
  position: absolute;
  top: 10px;
  left: 10px;
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
</style>
