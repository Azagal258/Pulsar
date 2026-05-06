<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, watch, ref } from 'vue'

const route = useRoute()
const output = ref<HTMLElement | null>(null)
const error = ref<string | null>(null)
const config: Record<string, { xml: string, xsl: string }> = {
    objekts: {
        xml: '/xslt/data/objekts.xml',
        xsl: '/xslt/styles/objekts-table.xsl'
    },
    triples: {
        xml: '/xslt/data/triples.xml',
        xsl: '/xslt/styles/members-table.xsl'
    },
    artms: {
        xml: '/xslt/data/artms.xml',
        xsl: '/xslt/styles/members-table.xsl'
    }
}

async function loadXslt(xmlPath: string, xslPath: string) {
    try {
        const [xmlText, xslText] = await Promise.all([
            fetch(xmlPath).then(r => r.text()),
            fetch(xslPath).then(r => r.text())
        ])

        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
        const xslDoc = parser.parseFromString(xslText, 'text/xml')

        const processor = new XSLTProcessor()
        processor.importStylesheet(xslDoc)

        const fragment = processor.transformToFragment(xmlDoc, document)

        if (output.value) {
            output.value.innerHTML = ''
            output.value.appendChild(fragment)
        }
    } catch (e) {
        error.value = 'Failed to load XSLT transformation.'
        console.error(e)
    }
}

function loadFromRoute() {
    const type = route.params.content as string

    if (!config[type]) {
        error.value = 'Unknown page'
        return
    }

    const { xml, xsl } = config[type]
    loadXslt(xml, xsl)
}

onMounted(loadFromRoute)

watch(() => route.params.content, loadFromRoute)
</script>

<template>
    <section class="objekts-general-infos" v-if="route.params.content === 'objekts'">
        <h1>More details on objekts!</h1>

        <h2>What are objekts?</h2>
        <p>Objekts are a blockchain-based photocard system in which all cards are NFTs.</p>
        <p>The blockchain currently used is Abstract, an Etherum-based <a href="https://en.wikipedia.org/wiki/Proof_of_stake">PoS</a> blockchain (which is much less energy intensive than Bitcoin <a href="https://en.wikipedia.org/wiki/Proof_of_work">PoW</a> system).</p>
        <p>Those NFTs can be bought, traded and accessed via an app called Cosmo, developed by Modhaus. Some cards are obtainable physically.</p>

        <h2>Seasons</h2>
        <p>Objekts are released by seasons. The current ones are :</p>
        <ul>
            <p class="sublist">For ARTMS and tripleS</p>
            <li>Atom01</li>
            <li>Binary01</li>
            <li>Cream01</li>
            <li>Divine01</li>
            <li>Ever01</li>
            <p class="sublist">For tripleS only</p>
            <li>Atom02</li>
            <li>Binary02</li>
        </ul>
        <p>Seasons are split in 3 Editions and last between 6 months and a year.</p>
        
        <p class="micro-pad">For idntt, Season are split in 4 (Spring, Summer, Autumn, Winter) and end with the two last digit of the current year.</p>
        <p>They last exactly three months.</p>


        <h2>Objekts</h2>
        <p>Objekts exists in multiple classes, and types.</p>
        <p>A good table is always better than a thousand words, so here are the diffent objekts classes, based on the group they come from.</p>

        <div v-if="error" class="error">
            {{ error }}
        </div>

        <div v-else ref="output"></div>

        <h2>Grids</h2>
        <p>A grid is a collection of 8 (for Edition 1&2) or 4 (Edition 3) unique FCO tied to one member of a group.</p>
        <p>The FCOs are buyable all throughout the Season but not after. </p>
        <p>There's a rolling 1 day period at the start of each edition where it's possible to specifically buy one member's own FCOs.</p>
        <p>Finishing a grid will render your FCOs untradable and grant you one of two version of the Edition's SCO at random.</p>

        <h2>Gravities/Como</h2>
        <p>Gravities are votes organized by Modhaus to let the fans decide on the direction of the group (can be about anything).</p>
        <p>The token used in Gravities are called Como and are specific to a group.</p>
        <p>A TripleS Objekt will grants TripleS' Como and an ARTMS Objekt will grant ARTMS Como.</p>
        <p>Como can't be bought by themselves. Receiving/Transferring an Objekt won't grant/remove Como</p>

        <h2>Spin</h2>
        <p>Spin is a system that allows you to reroll you objekts for a change of getting a better grade objekt.</p>
        <p><strong>IT IS POSSIBLE TO FAIL A SPIN, WHICH MAKES YOU LOOSE THE OBJEKT SPINNED</strong></p>
        <p><strong>SPINNING A SCO/PCO DOESN'T CHANGE THE ODDS OF UPGRADE AND IS THEREFORE NOT RECOMMENDED</strong></p>

        <h2>Physical Objekts</h2>
        <p>Objekts can exist in physical form (shown as <strong>xxxA</strong> on the collection number) or digital form (show as <strong>xxxZ</strong> on the collection number).</p>
        <p>A Physical Objekt can be digitalized by flashing the QR code in it's back.</p>
        
        <h2>Buying objekts</h2>
        <p>Objekts can be bought in GS25 (Korean convenience stores), in the Cosmo app shop, or in the <a href="https://shop.cosmo.fans/">Cosmo web store</a></p>
    </section>

    <section class="members-gi" v-if="route.params.content === 'triples' || route.params.content === 'artms'">
        <h1>More infos on the members!</h1>
        <div v-if="error" class="error">
            {{ error }}
        </div>

        <div v-else ref="output"></div>
    </section>


</template>

<style>
.objekts-general-infos {
    padding: 1rem;
}

.error {
    color: red;
}

.objekts-general-infos h2 {
    padding-top: 1rem;
    padding-bottom: .5rem;
}

.objekts-general-infos h3 {
    padding-top: .5rem;
}
.objekts-general-infos ul {
    padding-inline: 1rem;
}

.objekts-general-infos p.sublist, .objekts-general-infos p.micro-pad{
    margin-top: .5rem;
}

.objekts-general-infos thead,
.objekts-general-infos tfoot {
  background-color: #2c5e77;
  color: white;
  text-align: left;
}

.objekts-general-infos thead td {
    background-color: #15575c;
    color: white;
}

.objekts-general-infos tbody {
  background-color: #223b46;
}

.objekts-general-infos tbody th {
    background-color: #2c5e77;
    color: white;
    text-align: left;
}

.objekts-general-infos table {
  border-collapse: collapse;
  border: 2px solid rgb(140 140 140);
  font-family: sans-serif;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.objekts-general-infos caption {
  caption-side: bottom;
  padding: 10px;
}

.objekts-general-infos th,
.objekts-general-infos td {
  border: 1px solid rgb(160 160 160);
  padding: 8px 10px;
}

.objekts-general-infos td {
  text-align: center;
}

.members-gi th, .members-gi td {
    background-color: var(--member-color);
    color: var(--contrast-color);
    border: 1px solid rgb(160 160 160);
    padding: 8px 10px;
    text-align: center;
}

.members-gi table {
  border-collapse: collapse;
  border: 2px solid rgb(140 140 140);
  font-family: sans-serif;
  letter-spacing: 1px;
}

</style>

#22aeff / #000000
#a002fd / #FFFFFF
#fff924 / #000000
#9dbf41 / #000000
#d94387 / #000000
#fc83a4 / #000000
#6799a0 / #000000
#ffe3e2 / #000000
#ffc935 / #000000
#ff9ad6 / #000000
#fde000 / #000000
#5974ff / #000000
#ff953f / #000000
#1222b5 / #FFFFFF
#d51313 / #FFFFFF
#fe8e76 / #000000
#ab61b8 / #000000
#b8f54d / #000000
#52d9ba / #000000
#ff428a / #000000
#c7a3e0 / #000000
#7aba8c / #000000
#cff2ff / #000000
#ffab61 / #000000


#ed008f / #000000
#02c160 / #000000
#db3647 / #000000
#1824a7 / #FFFFFF
#5b2b93 / #FFFFFF