<script>
import tippy from '$lib/tippy';

export let rowNum;
export let rowStartTime;
export let rowEndTime;
export let purchaseWindow;
export let color;
export let numCells;

/** @type {HTMLElement} */
let rowWidth = 0;
let left = 0;
let width = 0;

// Must use useableRowWidth because there is one extra cell
// From the table time row
$: useableRowWidth = rowWidth - (rowWidth / numCells);

$: if (rowWidth) {
    console.log('Row', rowEndTime, rowStartTime);
    console.log('Window', purchaseWindow.end, purchaseWindow.start);
    const scheduleLength = rowEndTime.toDate() - rowStartTime.toDate();
    const purchaseWindowLength = purchaseWindow.duration;

    width = (purchaseWindowLength / scheduleLength) * useableRowWidth;
    left =
        ((purchaseWindow.start.toDate() - rowStartTime.toDate()) /
            1000 /
            60 /
            30) *
        (rowWidth / numCells);
}
</script>

<tr bind:clientWidth={rowWidth}>
    <!-- Drop off the last cell so the end time is on the end -->
    {#each new Array(numCells - 1).fill(null) as _}
        <td></td>
    {/each}
    <div
        class="purchase-window-row"
        style="width: {width}px; left: {left}px; background-color: {color};"
        use:tippy={'Purchase window ' + (rowNum + 1)} />
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

.purchase-window-row {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 75%;
    padding: 2px;
    border-radius: 5px;
}
</style>
