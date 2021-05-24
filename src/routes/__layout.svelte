<script>
import { signInAnonymously } from '$lib/auth';
import Navbar from '$lib/components/Navbar.svelte';
import Footer from '$lib/components/Footer.svelte';
import '../app.css';

signInAnonymously();
</script>

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
