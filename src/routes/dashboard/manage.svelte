<script>
import Button from '$lib/components/utility/Button.svelte';
import app, { firebase } from '$lib/firebase/firebase';
import { PurchaseWindow } from '$lib/purchase/window';
import PurchaseSchedule from '$lib/components/purchase/PurchaseSchedule.svelte';

let deleting = false;
async function deleteAllCarts() {
    deleting = true;
    await fetch('/dashboard.json', { method: 'DELETE' });
    deleting = false;
}

/** @type {Array<PurchaseWindow>} */
let purchaseWindows = [];
app.firestore().collection('purchase_windows')
    // .where(firebase.firestore.FieldPath.documentId, '!=', 'current')
    .withConverter(PurchaseWindow.converter)
    .get()
    .then((snapshot) => {
        for (let doc of snapshot.docs) {
            purchaseWindows.push({ id: doc.id, ...doc.data() });
        }
    });
</script>

<section class="purchase-windows">
    <h1>Purchase Windows by Day</h1>
    {#each new Array(7).fill(0) as _, i (i)}
        <PurchaseSchedule dayOfWeek={i} purchaseWindows={purchaseWindows.filter((window) => window.dayOfWeek === i)} />
    {/each}
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

.actions-list {
    display: flex;
    flex-flow: row wrap;
    gap: 15px 25px;
    margin-top: 15px;
}
</style>
