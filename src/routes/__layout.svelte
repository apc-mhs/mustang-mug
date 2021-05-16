<script>
import { signInAnonymously } from '$lib/auth';
import Navbar from './components/Navbar.svelte'; 
import Footer from './components/Footer.svelte';
import '../app.css';


signInAnonymously();
</script>

<main>
    <Navbar/>
    <slot />
    <Footer/>
</main>

<style>
:root {
    /*made styling annoying and not quite sure what the point was 
    --header-height: 50px;
    */
}

/*
these hardcoded elements are definitly 
*/
main {
    position: relative;
    top: var(--header-height);
    min-height: 100vh;background-color: rgb(71, 70, 70);
}
</style>
