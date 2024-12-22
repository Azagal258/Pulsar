<script setup lang="ts">

const objektClass = defineModel<string | undefined>("objektClass", {
  required: true,
});
const objektSeason = defineModel<string | undefined>("objektSeason", {
  required: true,
});
const group = defineModel<string | undefined>("group", { required: true });
const artist = defineModel<string | undefined>("artist", { required: true });

const tripleSMembers = [
  "SeoYeon",
  "HyeRin",
  "JiWoo",
  "ChaeYeon",
  "YooYeon",
  "SooMin",
  "NaKyoung",
  "YuBin",
  "Kaede",
  "DaHyun",
  "Kotone",
  "YeonJi",
  "Nien",
  "SoHyun",
  "Xinyu",
  "Mayu",
  "Lynn",
  "JooBin",
  "HaYeon",
  "ShiOn",
  "ChaeWon",
  "Sullin",
  "SeoAh",
  "JiYeon",
];

const tripleSSubunits = [
  "AAA",
  "EVOLution",
  "Glow",
  "KRE",
  "LOVELution",
  "NXT",
];

const tripleSArtists = [...tripleSMembers, ...tripleSSubunits];

const artmsMembers = ["HeeJin", "HaSeul", "KimLip", "JinSoul", "Choerry"];
const artmsSubunits = ["OEC"];

const artmsArtists = [...artmsMembers, ...artmsSubunits];
</script>

<template>
  <div class="row">
    <div class="col">
      <div class="fieldset">
        <label for="objektClass">Class</label>
        <select id="objektClass" v-model="objektClass">
          <option :value="undefined">All</option>
          <option value="First">First</option>
          <option value="Special">Special</option>
          <option value="Welcome">Welcome</option>
          <option value="Double">Double</option>
          <option value="Zero">Zero</option>
          <option value="Premier">Premier</option>
        </select>
      </div>
    </div>
    <div class="col">
      <div class="fieldset">
        <label for="objektSeason">Season</label>
        <select id="objektSeason" v-model="objektSeason">
          <option :value="undefined">All</option>
          <option value="Atom01">Atom01</option>
          <option value="Binary01">Binary01</option>
          <option value="Cream01">Cream01</option>
          <option value="Divine01">Divine01</option>
          <option value="Ever01">Ever01</option>
        </select>
      </div>
    </div>
    <div class="col">
      <div class="fieldset">
        <label for="group">Group</label>
        <select id="group" v-model="group" @change="artist = undefined">
          <option :value="undefined">All</option>
          <option value="artms">ARTMS</option>
          <option value="tripleS">tripleS</option>
        </select>
      </div>
    </div>
    <div class="col">
      <div class="fieldset">
        <label id="artist" v-if="group != undefined" for="artist">Artist</label>
        <select id="artist" v-if="group === 'artms'" v-model="artist">
          <option :value="undefined">All</option>
          <option v-for="artist in artmsArtists" :key="artist" :value="artist">
            {{ artist }}
          </option>
        </select>
        <select id="artist" v-if="group === 'tripleS'" v-model="artist">
          <option :value="undefined">All</option>
          <option
            v-for="artist in tripleSArtists"
            :key="artist"
            :value="artist"
          >
            {{ artist }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  gap: 1rem;
}

.col {
  flex: 1;
  width: 25%;
}

.fieldset {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0rem;
}
</style>
