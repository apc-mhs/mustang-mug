<script>
import { Time } from '$lib/purchase/window';
import PurchaseWindowRow from './PurchaseWindowRow.svelte';

export let colors;
export let purchaseWindows;
export let hours;
export let collapsed;

// Turn milliseconds between start and end into array of length
// of number of 30 min increments between start and end
const times = new Array(
    ((hours.end.toDate() - hours.start.toDate()) / 1000 / 60 / 30) + 1
)
    .fill(null)
    .map((_, i) => new Time(hours.start.hours, i * 30));
</script>

<table>
    {#if !collapsed}
        {#each purchaseWindows as purchaseWindow, i (purchaseWindow.id)}
            <PurchaseWindowRow
                purchaseWindows={[purchaseWindow]}
                rowStartTime={hours.start}
                rowEndTime={hours.end}
                colors={[colors[i % colors.length]]}
                numCells={times.length}
                rowNum={i} />
        {/each}
    {:else}
        <PurchaseWindowRow
            {purchaseWindows}
            rowStartTime={hours.start}
            rowEndTime={hours.end}
            {colors}
            numCells={times.length} />
    {/if}
    <tr class="times">
        {#each times as time, i (i)}
            <td
                >{new Intl.DateTimeFormat('en', {
                    hour: 'numeric',
                    minute: 'numeric',
                }).format(time.toDate())}</td>
        {/each}
    </tr>
</table>

<style>
table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 550px;
    align-self: flex-start;
}

tr.times > td {
    position: relative;
    transform: rotate(50deg);
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;
    width: 20px;
    top: 10px;
    left: -5px;
}

tr:not(:last-child) {
    border: 1px solid black;
}
</style>
