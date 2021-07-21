<script>
import { browser } from '$app/env';

import { page } from '$app/stores';

import { signInWithGoogle, signOut } from '$lib/auth';
import Button from '$lib/components/input/Button.svelte';
import getFirebase from '$lib/firebase';

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

if (browser) {
    getFirebase().then(({ app }) => {
        app.auth().onAuthStateChanged(function (user) {
            if (!user) {
                signInWithGoogle();
            } else {
                // User is still anonymously signed in, sign them out first
                if (!user.email) {
                    signOut();
                }
            }
        });
    });
}
</script>

<main>
    <aside class="menu">
        <nav>
            <h3>Dashboard</h3>
            {#each navLinks as link}
                <a href={link.href} class:current={link.href === $page.path}
                    >{link.name}</a>
            {/each}
        </nav>
        <Button on:click={() => signOut()}>Sign out</Button>
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
    height: 100vh;
    overflow: hidden;
}

aside.menu {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    position: sticky;
    top: 0px;
    min-width: 200px;
    flex: 0 0 auto;
    padding: 20px 10px;
    color: white;
    overflow-y: auto;
    height: 100%;
    gap: 5px;
}

.content {
    min-width: 400px;
    width: min-content;
    flex: 1 1 auto;
    height: 100%;
    overflow-y: auto;
}

nav {
    align-self: stretch;
    box-sizing: content-box;
    display: flex;
    flex-flow: column nowrap;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid gray;
    color: white;
    text-align: center;
}

nav > h3 {
    border-bottom: 1px solid gray;
    padding: 5px 0px;
}

nav > a {
    text-decoration: none;
    color: inherit;
    vertical-align: middle;
    line-height: 1;
    padding: 20px 0px;
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
