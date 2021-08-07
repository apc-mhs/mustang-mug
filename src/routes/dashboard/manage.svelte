<script>
import Button from '$lib/components/input/Button.svelte';
import { CurrentPurchaseWindow, PurchaseWindow } from '$lib/purchase/window';
import PurchaseSchedule from '$lib/components/purchase/PurchaseSchedule.svelte';
import getFirebase from '$lib/firebase';
import { onDestroy } from 'svelte';
import tippy from '$lib/tippy';
import { browser } from '$app/env';
import { getCurrentPurchaseWindow } from '$lib/purchase';
import IconButton from '$lib/components/input/IconButton.svelte';
import Icon from '$lib/components/utility/Icon.svelte';

const todayDayOfWeek = new Date().getDay();
const purchaseWindowRefresh = 30 * 1000;

let purchaseSchedulesElement;

let deleting = false;
/** @type {Array<PurchaseWindow>} */
let purchaseWindows = [];
let currentPurchaseWindow;
let interval = 0;

if (browser) {
    setupSnapshotListeners();
}

let unsubscribe = () => {};
onDestroy(() => {
    unsubscribe();
    clearInterval(interval);
});

function scrollToCurrentSchedule() {
    purchaseSchedulesElement.children[todayDayOfWeek].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
    });
}

async function deleteAllCarts() {
    deleting = true;
    await fetch('/dashboard/manage.json', { method: 'DELETE' });
    deleting = false;
}

function setupSnapshotListeners() {
    getFirebase().then(({ app, firebase }) => {
        app.firestore()
            .collection('purchase_windows')
            // .where(firebase.firestore.FieldPath.documentId, '!=', 'current')
            .withConverter(PurchaseWindow.converter(firebase.firestore.Timestamp))
            .get()
            .then((snapshot) => {
                for (let doc of snapshot.docs) {
                    if (doc.id === 'current') {
                        continue;
                    }
                    const window = doc.data();
                    window.id = doc.id;
                    purchaseWindows.push(window);
                }
                purchaseWindows = purchaseWindows;
            });

        unsubscribe = app.firestore()
            .collection('purchase_windows')
            .doc('current')
            .withConverter(CurrentPurchaseWindow.converter(firebase.firestore.Timestamp))
            .onSnapshot((snapshot) => {
                if (snapshot.exists) {
                    const purchaseWindow = snapshot.data();
                    currentPurchaseWindow = purchaseWindow.current ? purchaseWindow : null;
                } else {
                    currentPurchaseWindow = null;
                }
            });
    });

    // If the current purchase window becomes outdated, make a request to update it
    interval = setInterval(() => {
        if (currentPurchaseWindow && !currentPurchaseWindow.current) {
            getCurrentPurchaseWindow();
        }
    }, purchaseWindowRefresh);
}
</script>

<section class="purchase">
    <h1>Current Purchases</h1>
    <div class="progress-wrapper">
        {#if currentPurchaseWindow && currentPurchaseWindow.current}
            <div>
                <p class="min-label">0</p>
                <progress
                    max={currentPurchaseWindow.maxOrders}
                    value={currentPurchaseWindow.orders}
                    use:tippy={currentPurchaseWindow.orders + ' / ' + currentPurchaseWindow.maxOrders}>
                    0%
                </progress>
                <p class="max-label">{currentPurchaseWindow.maxOrders}</p>
            </div>
        {:else if currentPurchaseWindow === null}
            <p>Purchasing is currently disabled</p>
        {:else}
            <p>Loading...</p>
        {/if}
    </div>
    <h1 style="display: flex; align-items: center; justify-content: center; gap: 10px;">
        Purchase Windows by Day
        <IconButton on:click={scrollToCurrentSchedule}><Icon name="today"/></IconButton>
    </h1>
    <div class="purchase-schedules" bind:this={purchaseSchedulesElement}>
        {#each new Array(7).fill(null) as _, i (i)}
            <PurchaseSchedule
                dayOfWeek={i}
                purchaseWindows={purchaseWindows.filter(
                    (window) => window.dayOfWeek === i
                )}
                open={i === todayDayOfWeek} />
        {/each}
    </div>
</section>
<section class="actions">
    <h1>Actions</h1>
    <div class="actions-list">
        <Button disabled={deleting} on:click={deleteAllCarts}>
            {deleting ? 'Deleting...' : 'Delete all carts'}
        </Button>
    </div>
</section>

<style>
section {
    background-color: gray;
    margin: 10px;
    padding: 15px 10px;
    max-width: 100%;
}

h1 {
    text-align: center;
}

.actions-list {
    display: flex;
    flex-flow: row wrap;
    gap: 15px 25px;
    margin-top: 15px;
}

.purchase-schedules {
    display: flex;
    flex-flow: column nowrap;
    max-width: 10in;
    margin: 0px auto;
    gap: 50px 0px;
    padding: 25px 10px;
}

.progress-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
}

progress {
    height: 30px;
    width: 250px;
    background-color: green;
    border-radius: 10px;
    border: 1px solid rgb(71, 70, 70);
    overflow: hidden;
}

.progress-wrapper > div {
    position: relative;
}

.progress-wrapper p {
    position: absolute;
}

.progress-wrapper p.min-label {
    position: absolute;
    top: 105%;
    left: 0;
}

.progress-wrapper p.max-label {
    position: absolute;
    top: 105%;
    right: 0;
}
</style>
