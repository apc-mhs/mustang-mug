<script>
import { onMount } from 'svelte';
import Icon from './Icon.svelte';

// Show mobile icon and display menu
let showMobileMenu = false;

// List of navigation items
const navItems = [
    { label: 'Menu', href: '/' },
    {
        label: 'My School Bucks Account Creation',
        href: 'documentation/msb_account_creation.pdf',
    },
];

// Mobile menu click event handler
const handleMobileIconClick = () => (showMobileMenu = !showMobileMenu);

// Media match query handler
const mediaQueryHandler = (e) => {
    // Reset mobile state
    if (!e.matches) {
        showMobileMenu = false;
    }
};

// Attach media query listener on mount hook
onMount(() => {
    const mediaListener = window.matchMedia('(max-width: 767px)');

    mediaListener.addListener(mediaQueryHandler);
});
</script>

<nav>
    <div class="inner">
        <div
            on:click={handleMobileIconClick}
            class={`mobile-icon${showMobileMenu ? ' active' : ''}`}>
            <div class="middle-line" />
        </div>
        <img
            class="mug_logo"
            src="missingimage.jpg"
            alt="Mustang Mug Logo"
            height="45px"
            width="45px" />
        <p class="mug-text">Mustang Mug</p>
        <ul class={`navbar-list${showMobileMenu ? ' mobile' : ''}`}>
            {#each navItems as item}
                <li>
                    {#if item.label == 'My School Bucks Account Creation'}
                        <a href={item.href} target="_blank" rel="external"
                            >{item.label}</a>
                    {:else}
                        <a href={item.href}>{item.label}</a>
                    {/if}
                </li>
            {/each}
            <a href="cart">
                <Icon name="cart-icon" width="30" height="30" />
            </a>
        </ul>
    </div>
</nav>

<style>
.inner {
    max-width: 95vw;
    margin: auto;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    height: 100%;
}

nav {
    background-color: rgba(206, 44, 44, 0.8);
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    height: 6vh;
    position: relative;
    /* Is there a better way to do this?*/
    z-index: 9999;
    box-shadow: 0px 1px 5px 0px black;
}
.navbar-list {
    display: none;
    width: 100%;
    justify-content: flex-end;
    margin: 0;
    padding: 0 40px;
}

.navbar-list.mobile {
    background-color: rgba(0, 0, 0, 0.8);
    position: fixed;
    display: block;
    height: calc(100% - 6vh);
    bottom: 0;
    left: 0;
}

.navbar-list li {
    list-style-type: none;
    position: relative;
}

.navbar-list li:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
}

.navbar-list a {
    color: #fff;
    text-decoration: none;
    display: flex;
    height: 45px;
    align-items: center;
    padding: 0 10px;
    font-size: 13px;
}

.mobile-icon {
    width: 25px;
    height: 14px;
    position: relative;
    cursor: pointer;
}

.mobile-icon:after,
.mobile-icon:before,
.middle-line {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: #fff;
    transition: all 0.4s;
    transform-origin: center;
}

.mobile-icon:before,
.middle-line {
    top: 0;
}

.mobile-icon:after,
.middle-line {
    bottom: 0;
}

.mobile-icon:before {
    width: 66%;
}

.mobile-icon:after {
    width: 33%;
}

.middle-line {
    margin: auto;
}

.mobile-icon:hover:before,
.mobile-icon:hover:after,
.mobile-icon.active:before,
.mobile-icon.active:after,
.mobile-icon.active .middle-line {
    width: 100%;
}

.mobile-icon.active:before,
.mobile-icon.active:after {
    top: 50%;
    transform: rotate(-45deg);
}

.mobile-icon.active .middle-line {
    transform: rotate(45deg);
}

.mug-text {
    display: initial;
    color: white;
    font-size: 2em;
    text-decoration: none;
    margin-left: 1vw;
    /* this is a very hacky solution to not make the text stack on top of itself -- better fix anyone?*/
    min-width: 20vw;
}

@media only screen and (min-width: 767px) {
    .mobile-icon {
        display: none;
    }

    .navbar-list {
        display: flex;
        padding: 0;
    }

    .navbar-list a {
        display: inline-flex;
    }
}
</style>
