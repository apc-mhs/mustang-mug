<script>
import { page } from '$app/stores';

import { signInWithGoogle } from '$lib/auth';
import app from '$lib/firebase/firebase';

const navLinks = [
    {
        name: 'Orders',
        href: '/dashboard',
    },
    {
        name: 'Menu',
        href: '/dashboard/menu',
    },
    {
        name: 'Manage',
        href: '/dashboard/manage',
    },
];

app.auth().onAuthStateChanged(function (user) {
    if (!user) {
        signInWithGoogle();
    } else {
        if (!user.email) {
            app.auth().signOut();
        }
    }
});
</script>

<main>
    <aside class="menu">
        <nav>
            {#each navLinks as link}
                <a href={link.href} class:current={link.href === $page.path}
                    >{link.name}</a>
            {/each}
        </nav>
        <button on:click={() => app.auth().signOut()}>Sign out</button>
    </aside>
    <div class="content">
        <slot />
    </div>
</main>

<style>
main {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    min-height: 100vh;
}

aside.menu {
    position: sticky;
    top: 0px;
    min-width: 200px;
    flex: 0 0 auto;
    padding: 20px 10px;
    color: white;
}

.content {
    min-width: 400px;
    width: min-content;
    flex: 1 1 auto;
    background-color: hotpink;
}

nav {
    box-sizing: content-box;
    display: flex;
    flex-flow: column nowrap;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid gray;
}

nav > a {
    text-decoration: none;
    height: 75px;
    color: black;
}

nav > a:not(:last-child) {
    border-bottom: 1px solid gray;
}

nav > a.current {
    background-color: gray;
}

@media only screen and (max-width: 650px) {
    aside.menu {
        position: relative;
    }
}
</style>
