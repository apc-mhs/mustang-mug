<script>
let deleting = false;
async function deleteAllCarts() {
    deleting = true;
    await fetch('/dashboard.json', { method: 'DELETE' });
    deleting = false;
}
</script>

<button disabled={deleting} on:click={deleteAllCarts}>{deleting ? 'Deleting...' : 'Delete all carts'}</button>
