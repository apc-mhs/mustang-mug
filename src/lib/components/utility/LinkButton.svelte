<script>
import Button from '$lib/components/input/Button.svelte';

export let href;
export let disabled = false;
</script>

<a class="button" {href} {disabled} on:click>
    <Button {disabled}><slot /></Button>
</a>

<style>
a {
    text-decoration: none;
}
</style>
