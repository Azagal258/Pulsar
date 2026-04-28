<script setup lang="ts">
import { Entry, Transfers, TransferRenderer } from '../types/transfer';
import { ref, watch } from 'vue';

const address = "0xb678c008ced2a73f833d9bc26ca2bff593c1158c";
const offset = ref(0);
const transfersList = ref<TransferRenderer>([]);

function getOtherPerson(transfer: Entry, my_address: string): string[] {
    const MINT = "0x0000000000000000000000000000000000000000"
    const SPIN = "0xd3d5f29881ad87bb10c1100e2c709c9596de345f"

    if (transfer.from === MINT) {
        return [transfer.from, "Mint"]
    }
    else if (transfer.to === SPIN) {
        return [transfer.to, "Spin"]
    }
    else if (transfer.from === my_address) {
        return [transfer.to, "Sent to"]
    }
    else if (transfer.to === my_address) {
        return [transfer.from, "Received from"]
    }
    else {
        return ["Invalid", "Unknown"]
    }
}

const fetchTransfers = async (offset: number): Promise<TransferRenderer> => {

    let transferQuery = `
    query MyQuery {
        transfers(where: {from_eq: "${address}", OR: {to_eq: "${address}"}}, offset: ${offset}, orderBy: timestamp_DESC, limit: 100) {
            from
            to
            timestamp
            collection {
                collectionId
            }
            objekt {
                serial
            }
        }
    }`

    const response = await fetch("https://api.pulsar.azagal.eu/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: transferQuery,
        })
    }).then(response => response.json());

    const hrTimeTransfer : Transfers = response.data.transfers.map(transfers => ({
        ...transfers,
        created_at_hr_loc: new Date(transfers.timestamp).toLocaleString()
    }));

    const to_render = hrTimeTransfer.map(tval => {
        const [partner, transferType] = getOtherPerson(tval, address);

        return {
            collection: tval.collection.collectionId,
            serial: tval.objekt.serial,
            partner,
            transferType,
            timestamp: tval.created_at_hr_loc
        };
    });

    return to_render
};

const init = async () => {
    transfersList.value = await fetchTransfers(offset.value)
};

watch(offset, init, { immediate: true })

</script>
<template>
    <div class="container">
        <div class="table-header transfer-line">
            <div class="objekt-infos-wrapper">
                <span>Objekt</span>
            </div>
            <div class="partner-infos-wrapper">
                <span>Partner</span>
            </div>
            <span class="trade-time">Time</span>
        </div>
        <div v-for="singleTransfer in transfersList" class="transfer-line">
            <div class="objekt-infos-wrapper">
                <div>{{ singleTransfer.collection }}</div>
                <div>#{{ singleTransfer.serial }}</div>
            </div>
            <div class="partner-infos-wrapper">
                <div class="trade-type">{{ singleTransfer.transferType }}</div>
                <div class="trade-with">{{ singleTransfer.partner }}</div>
            </div>
            <span class="trade-time">{{ singleTransfer.timestamp }}</span>
        </div>
    </div>
</template>
<style scoped>

.container {
    --spacing: 0.25rem;
    display: flex;
    flex-direction: column;
    padding-inline: 5rem;
}

@media (max-width: 750px) {
    .container {
        padding-inline: 0rem;
    }
}

.transfer-line {
    display: grid;
    height: calc(var(--spacing)*14);
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr) minmax(0, 1fr);
    align-items: center;
    gap: calc(var(--spacing)*2);
    border-top-style: red solid;
    border-color: blue;
    padding-inline: calc(var(--spacing)*4);
}

.objekts-infos-wrapper {
    display: flex;
    flex-direction: column;
}

.trade-with {
    /* font-family: monospace; */
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.partner-infos-wrapper,
.objekt-infos-wrapper {
    min-width: 0;
}

.trade-time {
    text-align: right;
}


/* .container {
    display: grid;
    grid-template-columns: .5fr 1fr .5fr;
    grid-template-rows: repeat(auto-fill, 50px);
    padding-left: 1rem;
    padding-right: 1rem;
    align-items: center;
}

 .transfer-line {
    border: solid white 1px;
}

.partner-infos-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin: 0 auto;
    min-width: 0;
}

.trade-with {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    font-family: monospace;
}

.trade-time {
    text-align: right;
}

.objekt-infos-wrapper,
.trade-time,
.trade-type {
    white-space: nowrap;
} */
</style>
