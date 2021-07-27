<script>
import { signInAnonymously } from '$lib/auth';
import Navbar from '$lib/components/layout/Navbar.svelte';
import Footer from '$lib/components/layout/Footer.svelte';
import '../app.css';

let navbar;

signInAnonymously();
</script>

<svelte:head>
    <meta property="og:image" content="{import.meta.env.BASE_URL}/mustang-mug-logo.png}" />
</svelte:head>

<svelte:window on:sveltekit:navigation-start={() => navbar.closeMobileMenu()} />

<Navbar bind:this={navbar} />
<main>
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
