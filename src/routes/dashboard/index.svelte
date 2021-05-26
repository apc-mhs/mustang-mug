<script>
let deleting = false;
async function deleteAllCarts() {
    deleting = true;
    await fetch('/dashboard.json', { method: 'DELETE' });
    deleting = false;
}
</script>

<h1>Welcome to the dashboard</h1>
<button disabled={deleting} on:click={deleteAllCarts}>{deleting ? 'Deleting...' : 'Delete all carts'}</button>

<style>
* {
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
}
</style>
