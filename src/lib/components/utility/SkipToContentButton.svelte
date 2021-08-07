<script>
import LinkButton from "$lib/components/utility/LinkButton.svelte";
</script>

<div class="skip-to-content-wrapper">
    <LinkButton href="#main" external>Skip to content</LinkButton>
</div>

<style>
.skip-to-content-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    clip: rect(0, 0, 0, 0);
    z-index: 10;
}

.skip-to-content-wrapper:focus-within {
    clip: auto;
}
</style>
