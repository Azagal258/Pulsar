<script setup lang="ts">
    const objektClass = defineModel<string | null>("objektClass");
    const objektSeason = defineModel<string | null>("objektSeason");
    const objektGroup = defineModel<string | null>("objektGroup");
    const objektArtist = defineModel<string | null>("objektArtist");

    const objektsQuery = `
        query MyQuery {
            collections(where: {class_eq: "Special"}, limit: 15) {
                id
                front
            }
        }
        `;
        
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
    const imageList = parsedData.data.collections



    console.log(imageList);
</script>

<template>
    <div id="title">
        <h2>First objekts query</h2>
        <h2>{{ objektClass }}</h2>
        <h2>{{ objektSeason }}</h2>
        <h2>{{ objektGroup }}</h2>
        <h2>{{ objektArtist }}</h2>
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