<script>
import Button from '$lib/components/utility/Button.svelte';

let deleting = false;
async function deleteAllCarts() {
    deleting = true;
    await fetch('/dashboard.json', { method: 'DELETE' });
    deleting = false;
}
</script>

<Button disabled={deleting} on:click={deleteAllCarts}
    >{deleting ? 'Deleting...' : 'Delete all carts'}</Button>
