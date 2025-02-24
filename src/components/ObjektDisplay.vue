<script setup lang="ts">
    import { ref, watch } from "vue";
    import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js";
    const props = defineProps({
        objektClass : String,
        objektSeason : String,
        objektGroup : String,
        objektArtist : String
    });
    
    const objektsList = ref<any[]>([]);
    const selectedList = ref<any[]>([]);

    const recalculateImageList = async() => {
        const queryFilters = {
            class_eq: props.objektClass,
            season_eq: props.objektSeason,
            artists_containsAll: props.objektGroup,
            member_eq: props.objektArtist
        };

        const whereClause = Object.entries(queryFilters)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}: "${value}"`)
            .join(", ");
        
        const objektsQuery = `
            query MyQuery {
                collections(where: { ${whereClause} } , limit: 15, orderBy: timestamp_DESC) {
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
        });

        const parsedData = await response.json();
        objektsList.value = parsedData.data.collections;
        for (const unit of objektsList.value) {
            unit['front2x'] = unit.front.replace(/\/[^/]+$/, "/2x")
        }
    }

    const downloadImagesasZip = async() => {
        const zipMaker = new ZipWriter(new BlobWriter('application/zip'));

        for (const item of selectedList.value) {
            const response = await fetch(item.front);
            const blob = await response.blob();
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

    recalculateImageList();

    watch(
        props, recalculateImageList
    );

</script>

<template>
    <div id="download-button">
        <input 
            type="button"
            value="Download"
            @click="downloadImagesasZip"
        />
    </div>
    <div id="objekt-list">
        <p>Selected Objekts list :</p>
        <ul>
            <li v-for="objekt in selectedList" :key="objekt.id">{{ objekt.id }}</li>
        </ul>
    </div>
    <div class="container">
        <div v-for="singleObjekt in objektsList">
            <div class="image-wrapper">
                <img
                    class="image" 
                    :src="singleObjekt.front2x" 
                    :alt="singleObjekt.id" 
                />
                <input 
                    type="checkbox" 
                    class="buttontest"
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

@media (max-width : 860px) {
    .container{
        grid-template-columns: repeat(3, 1fr);
    }
}

body {
  padding: 1rem;
}

.image-wrapper .buttontest {
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