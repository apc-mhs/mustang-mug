<script>
import progress from "$lib/components/loading";
import { cubicIn } from "svelte/easing";
import { fade } from "svelte/transition";
</script>

{#if $progress }
    <div style="width: {$progress}%" out:fade={{ duration: 350, easing: cubicIn }}></div>
{/if}

<style>
div {
    width: 0%;
    height: 3px;
    background-color: rgba(114, 170, 233, 0.85);
}
</style>
