<script>
import { createEventDispatcher } from "svelte";

import Icon from "$lib/components/utility/Icon.svelte";
import IconButton from "$lib/components/input/IconButton.svelte";
import Input from "$lib/components/input/Input.svelte";
import TimeInput from "$lib/components/input/TimeInput.svelte";


export let purchaseWindow;
export let hours;

const dispatch = createEventDispatcher();

let start = purchaseWindow.start;
let end = purchaseWindow.end;

$: purchaseWindow.start = start;
$: purchaseWindow.end = end;

function clamp(time) {
    const timeDate = time.toDate();
    if (timeDate < hours.start.toDate()) return hours.start;
    else if (timeDate > hours.end.toDate()) return hours.end;
    else return time;
}
</script>

<TimeInput placeholder="Start time" bind:time={start} />
<p>&rarr;</p>
<TimeInput placeholder="End time" bind:time={end} />
<p>|</p>
<Input type="number" label="Max purchases:" bind:value={purchaseWindow.maxOrders} --width="70px" />
<IconButton on:click={() => dispatch('remove')}><Icon name="close" width="20" height="20" /></IconButton>

<style>
p {
    display: inline-block;
    color: white;
    font-size: 25px;
}
</style>
