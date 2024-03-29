<script>
import Button from '$lib/components/input/Button.svelte';
import PurchaseWindowEditor from './PurchaseWindowEditor.svelte';
import Icon from '$lib/components/utility/Icon.svelte';
import IconButton from '$lib/components/input/IconButton.svelte';
import PurchaseWindowDisplay from './PurchaseWindowDisplay.svelte';
import getFirebase from '$lib/firebase';
import { PurchaseWindow } from '$lib/purchase/window';
import { slide, fade } from 'svelte/transition';
import { sleep } from '$lib/utils';
import tippy from '$lib/tippy';
import { Time } from '$lib/purchase/time';
import { updateCurrentPurchaseWindow } from '$lib/purchase';
import { onMount, tick } from 'svelte';
import { browser } from '$app/env';

export let dayOfWeek;
export let purchaseWindows = [];
export let open = false;

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

let delayed = false;
let changed = false;
let collapsedDisplay = false;

$: dayName = days[dayOfWeek];
$: if (open) delayed = false;
$: if (purchaseWindows.length > 0 && !delayed) {
    sleep(350).then(() => (delayed = true));
}

const isDelayed = () => delayed;
$: if (purchaseWindows && isDelayed()) {
    changed = true;
}

async function removePurchaseWindow(i) {
    const [purchaseWindow] = purchaseWindows.splice(i, 1);
    purchaseWindows = purchaseWindows;

    const { app } = await getFirebase();
    app.firestore()
        .collection('purchase_windows')
        .doc(purchaseWindow.id)
        .delete();

    if (purchaseWindow.current) {
        await app.firestore()
            .collection('purchase_windows')
            .doc('current')
            .delete();
    }
}

async function addPurchaseWindow() {
    const purchaseWindow = new PurchaseWindow(
        dayOfWeek,
        new Time(hours.start.hours, hours.start.minutes),
        new Time(hours.end.hours, hours.end.minutes),
        20
    );

    const { app, firebase } = await getFirebase();
    const document = app
        .firestore()
        .collection('purchase_windows')
        .withConverter(PurchaseWindow.converter(firebase.firestore.Timestamp))
        .doc();

    purchaseWindow.id = document.id;
    purchaseWindows = [
        ...purchaseWindows,
        purchaseWindow,
    ];
    document.set(purchaseWindow);
}

async function saveSchedule() {
    const { app, firebase } = await getFirebase();
    for (let purchaseWindow of purchaseWindows) {
        purchaseWindow.lastModified = new Date();
        app.firestore()
            .collection('purchase_windows')
            .doc(purchaseWindow.id)
            .withConverter(
                PurchaseWindow.converter(firebase.firestore.Timestamp)
            )
            .set(purchaseWindow);
    }

    const currentPurchaseWindowRef = app
        .firestore()
        .collection('purchase_windows')
        .doc('current');

    currentPurchaseWindowRef.get().then((snapshot) => {
        // Document already exists, merge in new data without overwriting "orders"
        updateCurrentPurchaseWindow(snapshot.exists);
    });

    changed = false;
}
</script>

<div class="purchase-schedule">
    <div class="header">
        <h2>{dayName} - {purchaseWindows.length}</h2>
        <div class="button" class:flipped={open}>
            <IconButton on:click={() => (open = !open)}>
                <Icon
                    name="drop-down"
                    width="25"
                    height="25"
                    --background-color="gray" />
            </IconButton>
        </div>
    </div>
    {#if open}
        <div transition:slide|local>
            <div class="purchase-windows">
                {#each purchaseWindows as purchaseWindow, i (purchaseWindow.id)}
                    <div class="purchase-window" transition:slide|local>
                        <div
                            class="color-bubble"
                            style="--color: {colors[i % colors.length]}" />
                        <p>Purchase window {i + 1}</p>
                        <!-- Must bind on list index to make the list react -->
                        <PurchaseWindowEditor
                            {hours}
                            bind:purchaseWindow={purchaseWindows[i]}
                            on:remove={() => removePurchaseWindow(i)} />
                    </div>
                {:else}
                    <p>
                        <em>
                            No purchase windows defined for {dayName}.
                            Purchasing will be disabled.
                        </em>
                    </p>
                {/each}
            </div>
            <div class="purchase-window-display">
                <div class="button-panel">
                    <Button on:click={addPurchaseWindow}>
                        <Icon name="plus" width="20" height="20" />
                        Add Window
                    </Button>
                    <div use:tippy={!changed ? 'Make a change to save' : undefined}>
                        <Button
                            on:click={saveSchedule}
                            disabled={!changed}>
                            Save Schedule
                        </Button>
                    </div>
                    {#if purchaseWindows.length > 0 && delayed}
                        <label>
                            Collapsed:
                            <input
                                type="checkbox"
                                bind:checked={collapsedDisplay} />
                        </label>
                    {/if}
                </div>
                {#if purchaseWindows.length > 0 && delayed}
                    <div in:fade|local>
                        <PurchaseWindowDisplay
                            {purchaseWindows}
                            {colors}
                            {hours}
                            collapsed={collapsedDisplay} />
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
.purchase-schedule {
    display: flex;
    flex-flow: column nowrap;
    max-width: 100%;
    text-align: center;
    align-items: center;
    border-top: 2px solid black;
}

.header {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 0px 10px;
    padding: 5px;
    margin-bottom: 5px;
}

.header .button {
    transition: transform 200ms ease;
    cursor: pointer;
}

.header .button.flipped {
    transform: rotate(180deg);
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
    gap: 0px 15px;
    align-items: stretch;
    min-height: 80px;
}

.purchase-window-display .button-panel {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    gap: 3px;
}
</style>
