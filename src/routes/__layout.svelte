<script>
import { signInAnonymously } from '$lib/auth';
import Navbar from '$lib/components/Navbar.svelte';
import Footer from '$lib/components/Footer.svelte';
import '../app.css';

signInAnonymously();
</script>

<!-- Navbar and Footer should be moved outside of main -->
<main>
    <Navbar />
    <slot />
    <Footer />
</main>

<style>
:root {
    --header-height: 6vh;
}
/* These hardcoded elements are definitly not ideal - should probably be revised */
main {
    position: relative;
    /* Commented out due to extra space being created with it present
    top: var(--header-height); */
    min-height: 100vh;
    background-color: rgb(71, 70, 70);
}
</style>
