<script setup lang="js">

const objektsQuery = `
    query MyQuery 
        {collections(limit: 10){
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

    const resultData = await response.json();
    const parsedData = await JSON.parse(resultData);
    var getimage = document.createElement("img");
    getimage.onload = function(){
        document.getElementById("objekts").appendChild(getimage)
    }
    getimage.src = parsedData.collection.front;


    console.log(resultData);

</script>

<template>
    <div id="title">
        <h2>10 first objekts query</h2>
    </div>
    <div id="objekts"></div>
</template>

<style>

</style>