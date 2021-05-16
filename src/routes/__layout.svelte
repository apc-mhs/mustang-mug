<script>
import { signInAnonymously } from '$lib/auth';
import '../app.css';

signInAnonymously();
</script>

<main>
    <slot />
</main>

<style>
:root {
    --header-height: 50px;
}

main {
    position: relative;
    top: var(--header-height);
    min-height: calc(100vh - var(--header-height));
}
</style>
