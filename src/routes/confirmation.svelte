<script>
import { browser } from '$app/env';

import { currentUser } from '$lib/auth';
import getFirebase from '$lib/firebase';

let resultCodes = null;
$: if (browser) {
    getFirebase().then(({ app }) => {
        if (!app.auth().currentUser) return;

        app.firestore()
            .collection('carts')
            .doc(app.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    resultCodes = snapshot.data().resultCodes;
                } else {
                    resultCodes = [];
                }
            })
            .catch((err) => (resultCodes = []));
    });
}
</script>

<svelte:head>
    <title>Confirmation {resultCodes}</title>
</svelte:head>

<h1>This page will be for to confirm when someone's order goes through.</h1>
<h2>Results of your payment</h2>
{#if resultCodes !== null}
    <ul>
        {#each resultCodes as resultCode, i (i)}
            <li><strong>Result {i + 1}</strong>: {resultCode}</li>
        {:else}
            <li>No results</li>
        {/each}
    </ul>
{:else}
    <p>Loading resultCodes...</p>
{/if}

<style>
* {
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    color: white;
}
</style>
