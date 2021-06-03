<script>
import Button from './Button.svelte';

export let disabled = false;
</script>

<Button
    on:click
    {disabled}
    --font-size="20px"
    --border-radius="200px"
    --box-shadow="none"
    --padding="9px"
    --background-color="gray">
    <slot />
</Button>


<style>

</style>
