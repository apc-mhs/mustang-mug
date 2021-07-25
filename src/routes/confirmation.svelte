<script>
import { browser } from '$app/env';
import { currentUser } from '$lib/auth';
import Icon from '$lib/components/utility/Icon.svelte';

import getFirebase from '$lib/firebase';

let resultCodes = null;
let resultStatus = null;
$: if (browser && $currentUser) {
    getFirebase().then(({ app }) => {
        app.firestore()
            .collection('carts')
            .doc($currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    const data = snapshot.data();
                    resultCodes = data.resultCodes || [];
                    resultStatus = data.resultStatus;
                } else {
                    resultCodes = [];
                }
            })
            .catch((err) => (resultCodes = []));
    });
}
</script>

<svelte:head>
    <title>Payment Confirmation - Mustang Mug</title>
</svelte:head>

<section>
    <h1><Icon name="check"/> Your order is being processed. Thanks for shopping at the Mustang Mug!</h1>
    <h2>Results of your payment</h2>
    {#if resultStatus}
        <p>Result status: {resultStatus}</p>
    {/if}
    {#if resultCodes !== null}
        <ul>
            {#each resultCodes as resultCode, i (i)}
                <li><strong>Result {i + 1}</strong>: {resultCode}</li>
            {:else}
                <li>No results</li>
            {/each}
        </ul>
    {:else}
        <p>Loading results...</p>
    {/if}
</section>

<style>
* {
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    color: white;
}

section {
    padding: 20px 40px;
}
</style>
