<script setup lang="ts">
    import { ref, watch } from "vue"
    const props = defineProps({
        objektClass : String,
        objektSeason : String,
        objektGroup : String,
        objektArtist : String
    });
    
    const imageList = ref<any[]>([]);
    
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
        imageList.value = parsedData.data.collections;
    }

    recalculateImageList();

    watch(
        props, recalculateImageList
    );

</script>

<template>
    <div id="title">
        <h2>First objekts query</h2>
    </div>
    <div class="container">
        <img v-for="singleImage in imageList" :src="singleImage.front" :alt="singleImage.id" width="100%"/>
    </div>
</template>

<style scoped>
.container{
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
}

#title{
    margin-bottom: 1rem;
    text-align: center;
}

@media (max-width : 860px) {
    .container{
        grid-template-columns: repeat(2, 1fr);
    }
}

body {
  padding: 1rem;
}
</style>