<script>
export let disabled = false;
</script>

<button class="button" {disabled} on:click >
    <slot />
</button>

<style>
button {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    gap: var(--gap, 5px);
    background-color: var(--background-color, rgb(206, 44, 44));
    border-radius: var(--border-radius, 3px);
    border: 1px solid #0b0e07;
    cursor: pointer;
    color: white;
    font-size: var(--font-size, 16px);
    padding: var(--padding, 8px 22px);
    box-shadow: var(--box-shadow, 0px 0px 0px 0px rgba(0, 0, 0, 0.2));
    /* Border radius transition comes from horizontalSlide defaults */
    transition: background-color 250ms ease, box-shadow 250ms ease,
        color 250ms ease, padding 250ms ease;
    -webkit-tap-highlight-color: transparent;
    text-decoration: none;
}
button:hover {
    background-color: var(--background-color-hover, var(--background-color, rgb(126, 33, 33)));
    box-shadow: 0px 0px 5px 1px rgb(0 0 0 / 20%);
}
button:active {
    background-color: var(--background-color-active, var(--background-color, rgb(82, 23, 23)));
}
button:disabled {
    cursor: not-allowed;
    color: rgb(201, 201, 201);
    background-color: var(--background-color-disabled, var(--background-color, rgb(90, 47, 47)));
}
button :global(*) {
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
}
</style>
