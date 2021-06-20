<script>
import tippy from '$lib/tippy';
import { onMount } from 'svelte';

export let rowStartTime;
export let rowEndTime;
export let purchaseWindows;
export let colors;
export let numCells;
export let rowNum = 0;

let purchaseWindowBoxes = [];

/** @type {HTMLElement} */
let rowWidth = 0;

// Must use useableRowWidth because there is one extra cell
// From the table time row
$: useableRowWidth = rowWidth - (rowWidth / numCells);

$: if (rowWidth) {
    purchaseWindowBoxes = [];

    for (let i = 0; i < purchaseWindows.length; i++) {
        const purchaseWindow = purchaseWindows[i];
        const scheduleLength = rowEndTime.toDate() - rowStartTime.toDate();
        const purchaseWindowLength = purchaseWindow.duration;

        const width = (purchaseWindowLength / scheduleLength) * useableRowWidth;
        const left =
            ((purchaseWindow.start.toDate() - rowStartTime.toDate()) /
                1000 /
                60 /
                30) *
            (rowWidth / numCells);

        purchaseWindowBoxes.push({
            id: purchaseWindow.id,
            width,
            left,
            color: colors[i % colors.length],
        });
    }

    purchaseWindowBoxes = purchaseWindowBoxes;
}
</script>

<tr bind:clientWidth={rowWidth}>
    <!-- Drop off the last cell so the end time is on the end -->
    {#each new Array(numCells - 1).fill(null) as _}
        <td></td>
    {/each}
    {#each purchaseWindowBoxes as {id, width, left, color}, i (id)}
        <div
            class="purchase-window"
            style="width: {width}px; left: {left}px; background-color: {color};"
            use:tippy={'Purchase window ' + ((i || rowNum) + 1)} />
    {/each}
</tr>

<style>
tr {
    position: relative;
    width: 100%;
    height: 20px;
    border-collapse: collapse;
}

td {
    border: 1px solid black;
    border-collapse: collapse;
    /* outline: 1px solid black; */
}

.purchase-window {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 75%;
    padding: 2px;
    border-radius: 5px;
}
</style>
