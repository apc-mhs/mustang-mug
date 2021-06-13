<script>
import Button from '$lib/components/utility/Button.svelte';
import { PurchaseWindow } from '$lib/purchase/window';
import PurchaseSchedule from '$lib/components/purchase/PurchaseSchedule.svelte';
import getFirebase from '$lib/firebase';

let deleting = false;
async function deleteAllCarts() {
    deleting = true;
    await fetch('/dashboard.json', { method: 'DELETE' });
    deleting = false;
}

/** @type {Array<PurchaseWindow>} */
let purchaseWindows = [];
let currentPurchaseWindow;
getFirebase().then(({ app, firebase }) => {
    app.firestore().collection('purchase_windows')
        // .where(firebase.firestore.FieldPath.documentId, '!=', 'current')
        .withConverter(PurchaseWindow.converter(firebase.firestore.Timestamp))
        .get()
        .then((snapshot) => {
            for (let doc of snapshot.docs) {
                if (doc.id === 'current') {
                    const window = doc.data();
                    window.id = doc.id;
                    currentPurchaseWindow = window;
                    continue;
                }

                const window = doc.data();
                window.id = doc.id;
                purchaseWindows.push(window);
            }
            purchaseWindows = purchaseWindows;
        });
});
</script>

<section class="purchase">
    <h1>Purchase Windows by Day</h1>
    <div class="purchase-schedules">
        {#each new Array(7).fill(null) as _, i (i)}
            <PurchaseSchedule dayOfWeek={i} purchaseWindows={purchaseWindows.filter((window) => window.dayOfWeek == i)} />
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
}
</style>
