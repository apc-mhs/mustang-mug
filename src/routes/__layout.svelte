<script>
import { signInAnonymously } from '$lib/auth';
import Navbar from '$lib/components/layout/Navbar.svelte';
import Footer from '$lib/components/layout/Footer.svelte';
import '../app.css';

signInAnonymously();
</script>


<!-- Using svelte:head on the layout will overwrite every other page 
Instead we use just <head> and <title> which will set the title for 
all the pages that don't have a svelte:head (you can test it!) -->
<head>
    <title>Dashboard</title>
</head>

<Navbar />
<main>
    <slot />
    <Footer />
</main>

<style>
:root {
    --header-height: 50px;
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
