<script context="module">
import { browser } from '$app/env';

export function load({ error, status }) {
    if (!browser && status >= 500) {
        console.error(error.stack);
    }

    return {
        props: {
            error,
            status,
        },
    };
}
</script>

<script>
import { navigateBack } from '$lib/utils';

export let error;
export let status;
</script>

{#if status === 404}
    <div class="not-found">
        <h1>404 Error</h1>
        <h3>Page not found</h3>
        <!-- TODO: Link to menu and cart pages -->
        <p>Head back to the menu or view your cart</p>
    </div>
{:else}
    <div class="other-error">
        <h1>{status} Error</h1>
        <h3>{error.message}</h3>
        <p>
            {#if status >= 500}
                An internal error prevented your action from succeeding.
            {:else}
                Your request could not be processed.
            {/if}
            Try <a href="/" on:click={navigateBack}>going back</a> or visit the
            <a href="/">homepage</a>.
        </p>
    </div>
{/if}

<style>
.not-found,
.other-error {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
}

.not-found > *,
.other-error > * {
    text-align: center;
    max-width: 75ch;
}
</style>
