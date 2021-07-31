<script>
import Button from '$lib/components/input/Button.svelte';

export let href;
export let disabled = false;
</script>

<a class="button" {href} {disabled} tabindex="-1">
    <Button {disabled}><slot /></Button>
</a>

<style>
a {
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
}
</style>
