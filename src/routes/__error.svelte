<script context="module">
import { browser, dev } from '$app/env';

export function load({ error, status }) {
    if ((!browser || dev) && status >= 500) {
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
    <div class="center">
        <div class="error">
            <div class="number">4</div>
            <div class="coffeemug">
                <img
                    src="coffeemug.png"
                    alt="Coffee Cup"
                    height="230px"
                    width="230px"
                />
            </div>
            <div class="number">4</div>
        </div>
    </div>
    <div class="not-found">
        <h3>Page not found</h3>
        <p>
            Head back to the <a href="/">menu</a> or view your
            <a href="cart">cart</a>
        </p>
    </div>
{:else}
    <div class="other-error">
        <div class="error">
            <div class="number">5</div>
            <div class="coffeemug">
                <img
                    src="coffeemug.png"
                    alt="Coffee Cup"
                    height="230px"
                    width="230px"
                />
            </div>
            <div class="number">{status.toString().substring(2)}</div>
        </div>
        <h3>{error.message}</h3>
        <p>
            {#if status >= 500}
                An internal error occured during your request.
            {:else}
                Your request could not be processed.
            {/if}
            Try <a href="/" on:click={navigateBack}>going back</a> or visit the
            <a href="/">homepage</a>.
        </p>
    </div>
{/if}

<style>
* {
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    color: white;
    margin-top: 3vh;
}

.not-found,
.other-error {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
}
.error {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
}

.not-found > *,
.other-error > * {
    text-align: center;
    max-width: 75ch;
}

.center {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.number {
    font-weight: 900;
    font-size: 15rem;
    line-height: 1;
    text-shadow: 10px 10px 4px rgba(0, 0, 0, 0.2);
}

.coffeemug {
    margin-top: 20px;
    margin-left: 20px;
}
</style>
