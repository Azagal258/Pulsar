<script setup lang="ts">
    const objektsQuery = `
        query MyQuery 
            {collections(limit: 18){
                front
                id
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
        <h2>10 first objekts query</h2>
    </div>
    
    <div class="container">
        <img v-for="singleImage in imageList" v-bind:src="singleImage.front" v-bind:alt="singleImage.id" width="100%"/>
    </div>
</template>

<style>
/* div.container img{
    border: 1px dotted aqua;
} */ 
.container{
    display: grid;
    grid-template-columns: 18% 18% 18% 18% 18%;
    gap: 2%;
}
</style>