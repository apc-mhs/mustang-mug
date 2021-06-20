<script>
import { createEventDispatcher } from "svelte";

import Icon from "../utility/Icon.svelte";
import IconButton from "../utility/IconButton.svelte";
import Input from "../utility/Input.svelte";
import TimeInput from "../utility/TimeInput.svelte";


export let purchaseWindow;
export let hours;

const dispatch = createEventDispatcher();

let start = purchaseWindow.start;
let end = purchaseWindow.end;

$: purchaseWindow.start = clamp(start);
$: purchaseWindow.end = clamp(end);

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
<Input label="Max purchases:" bind:value={purchaseWindow.maxOrders} --width="50px" />
<IconButton on:click={() => dispatch('remove')}><Icon name="close" width="20" height="20" /></IconButton>

<style>
p {
    display: inline-block;
    color: white;
    font-size: 25px;
}
</style>
