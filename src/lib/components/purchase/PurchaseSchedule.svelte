<script>
import { Time } from '$lib/purchase/window';
import Button from '../utility/Button.svelte';
import PurchaseWindowEditor from './PurchaseWindowEditor.svelte';
import Icon from '$lib/components/utility/Icon.svelte';
import PurchaseWindowDisplay from './PurchaseWindowDisplay.svelte';
import getFirebase from '$lib/firebase';
import { PurchaseWindow } from '$lib/purchase/window';
import { slide } from 'svelte/transition';
import { sleep } from '$lib/utils';

export let dayOfWeek;
export let purchaseWindows = [];

const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];
const hours = {
    start: new Time(8),
    end: new Time(16),
};
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];


$: dayName = days[dayOfWeek];
let delayed = false;
$: if (purchaseWindows.length > 0) {
    sleep(1000).then(() => delayed = true);
}

let collapsedDisplay = false;

async function removePurchaseWindow(i) {
    const [purchaseWindow] = purchaseWindows.splice(i, 1);
    purchaseWindows = purchaseWindows;

    const { app } = await getFirebase();
    app.firestore()
        .collection('purchase_windows')
        .doc(purchaseWindow.id)
        .delete();
}

async function addPurchaseWindow() {
    const purchaseWindow = new PurchaseWindow(
        dayOfWeek,
        new Time(hours.start.hours),
        new Time(hours.end.hours),
        20
    );

    const { app, firebase } = await getFirebase();
    const document = app
        .firestore()
        .collection('purchase_windows')
        .withConverter(PurchaseWindow.converter(firebase.firestore.Timestamp))
        .doc();

    purchaseWindows = [
        ...purchaseWindows,
        { id: document.id, ...purchaseWindow }
    ];

    document.set(purchaseWindow);
}
</script>

<div class="purchase-schedule">
    <h2>{dayName}</h2>
    <div class="purchase-windows">
        {#each purchaseWindows as purchaseWindow, i (purchaseWindow.id)}
            <div class="purchase-window" transition:slide|local>
                <div
                    class="color-bubble"
                    style="--color: {colors[i % colors.length]}" />
                <p>Purchase window {i + 1}</p>
                <!-- Must bind on list index to make the list react -->
                <PurchaseWindowEditor
                    bind:purchaseWindow={purchaseWindows[i]}
                    on:remove={() => removePurchaseWindow(i)} />
            </div>
        {:else}
            <p>
                <em>
                    No purchase windows defined for {dayName}. Purchasing will be disabled.
                </em>
            </p>
        {/each}
    </div>
    <div class="purchase-window-display">
        <div>
            <Button on:click={addPurchaseWindow}
            ><Icon name="plus" width="20" height="20" />Add Window</Button>
            {#if purchaseWindows.length > 0}
                <label>
                    Collapse:
                    <input type="checkbox" bind:checked={collapsedDisplay}>
                </label>
            {/if}
        </div>
        {#if purchaseWindows.length > 0 && delayed}
            <PurchaseWindowDisplay {purchaseWindows} {colors} {hours} collapsed={collapsedDisplay} />
        {/if}
    </div>
</div>

<style>
.purchase-schedule {
    display: flex;
    flex-flow: column nowrap;
    max-width: 100%;
    text-align: center;
    align-items: center;
    gap: 5px 0px;
}

tr {
    display: flex;
    flex-flow: row nowrap;
}

.purchase-window {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
    transform-origin: top center !important;
}

.purchase-windows {
    display: flex;
    flex-flow: column nowrap;
    gap: 5px 0px;
}

.color-bubble {
    height: 15px;
    width: 15px;
    border-radius: 50%;
    background-color: var(--color);
}

.purchase-window-display {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    gap: 0px 15px;
}
</style>
