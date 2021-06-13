<script>
import { createEventDispatcher } from "svelte";

import Icon from "../utility/Icon.svelte";
import IconButton from "../utility/IconButton.svelte";
import Input from "../utility/Input.svelte";

export let purchaseWindow;

let { start, end } = purchaseWindow;

const dispatch = createEventDispatcher();

const dateFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' });
</script>

<Input placeholder="7:00 AM" value={dateFormatter.format(purchaseWindow.start.toDate())} />
<p>&rarr;</p>
<Input placeholder="8:50 AM" value={dateFormatter.format(purchaseWindow.end.toDate())} />
<p>|</p>
<Input placeholder="Max purchases" bind:value={purchaseWindow.maxOrders} />
<IconButton on:click={() => dispatch('remove')}><Icon name="close" width="20" height="20" /></IconButton>

<style>
p {
    display: inline-block;
    color: white;
    font-size: 25px;
}
</style>
