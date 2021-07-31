<script>
import { signInAnonymously } from '$lib/auth';
import Navbar from '$lib/components/layout/Navbar.svelte';
import Footer from '$lib/components/layout/Footer.svelte';
import { page } from '$app/stores';
import '../app.css';
import SkipToContentButton from '$lib/components/utility/SkipToContentButton.svelte';

let navbar;

signInAnonymously();
</script>

<svelte:head>
    <meta property="og:image" content="https://{$page.host}/mustang-mug-logo.png" />
</svelte:head>

<svelte:window on:sveltekit:navigation-start={() => navbar.closeMobileMenu()} />

<SkipToContentButton />
<Navbar bind:this={navbar} />
<main id="main">
    <slot />
    <Footer />
</main>

<style>
:root {
    --header-height: 60px;
}

main {
    display: flex;
    flex-flow: column nowrap;
    position: relative;
    top: var(--header-height);
    min-height: calc(100vh - var(--header-height));
    background-color: rgb(71, 70, 70);
}
</style>
