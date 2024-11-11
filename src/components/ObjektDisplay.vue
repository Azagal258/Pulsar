<script setup lang="ts">
    import { ref, watch } from "vue"
    const props = defineProps({
        objektClass : String,
        objektSeason : String,
        objektGroup : String,
        objektArtist : String
    })
    
    const imageList = ref<any[]>([])
    
    const recalculateImageList = async() => {
        const queryFilters = {
            class_eq : props.objektClass,
            season_eq : props.objektSeason,
            artists_containsAll : props.objektGroup,
            member_eq : props.objektArtist
        }

        const whereClause = Object.entries(queryFilters)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}: "${value}"`)
            .join(", ")
        
        const objektsQuery = `
            query MyQuery {
                collections(where: { ${whereClause} } , limit: 15, orderBy: timestamp_DESC) {
                    id
                    front
                }
            }`
        console.log(objektsQuery);

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
        imageList.value = parsedData.data.collections
    };

    console.log(imageList.value)

    recalculateImageList();

    watch(
        props, recalculateImageList
    )

    console.log(imageList)
</script>

<template>
    <div id="title">
        <h2>First objekts query</h2>
    </div>
    
    <div class="container">
        <img v-for="singleImage in imageList" :src="singleImage.front" :alt="singleImage.id" width="100%"/>
    </div>
</template>

<style>
/* div.container img{
    border: 1px dotted aqua;
} */ 
.container{
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
}

@media (max-width : 800px) {
    .container{
        grid-template-columns: repeat(3, 1fr);
    }
}
</style>