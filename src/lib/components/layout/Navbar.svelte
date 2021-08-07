<script>
import Icon from '$lib/components/utility/Icon.svelte';
import { useMediaQuery } from '$lib/utils';
import TopLoadingBar from '$lib/components/loading/TopLoadingBar.svelte';

// Show mobile icon and display menu
const mobile = useMediaQuery('(max-width: 767px)');
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

$: if (!$mobile) closeMobileMenu();

export function closeMobileMenu() {
    showMobileMenu = false;
}
</script>

<nav>
    <div class="inner">
        <div
            on:click={handleMobileIconClick}
            class="mobile-icon"
            class:active={showMobileMenu}>
            <div class="upper-line" />
            <div class="middle-line" />
            <div class="lower-line" />
        </div>
        <a href="/" class="mug-text">
            <img class="mug_logo"
                src="/mustang-mug-logo.png"
                alt="Mustang Mug Logo"
                height="45px"
                width="45px">
            Mustang Mug
        </a>
        <ul class="navbar-list" class:mobile={showMobileMenu}>
            {#each navItems as item}
                <li>
                    {#if item.label == 'MySchoolBucks Help'}
                        <a href={item.href} target="_blank" rel="external"
                            >{item.label}</a>
                    {:else}
                        <a href={item.href}>{item.label}</a>
                    {/if}
                </li>
            {/each}
            <li>
                <a href="cart"
                    ><Icon name="cart-icon" width="30" height="30" /></a>
            </li>
        </ul>
    </div>
    <TopLoadingBar />
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

.inner > * {
    margin-right: 5px;
}

nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    background-color: rgba(206, 44, 44, 0.85);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    height: var(--header-height);
    z-index: 5;
    box-shadow: 0px 1px 5px 0px black;
}
.navbar-list {
    display: none;
    justify-content: flex-end;
    margin-left: auto;
    padding: 0 40px;
}

.navbar-list.mobile {
    background-color: rgba(0, 0, 0, 0.8);
    position: fixed;
    display: block;
    height: calc(100vh - var(--header-height));
    width: 100vw;
    top: var(--header-height);
    left: 0;
}

.navbar-list li {
    list-style-type: none;
    position: relative;
}

.navbar-list a {
    color: #fff;
    text-decoration: none;
    display: flex;
    height: 45px;
    align-items: center;
    padding: 0 10px;
    font-size: 16px;
}

.mobile-icon {
    width: 25px;
    --icon-height: 14px;
    height: var(--icon-height);
    position: relative;
    cursor: pointer;
}

.mobile-icon > div {
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: #fff;
    transition: all 0.4s;
    transform-origin: center;
}

div.upper-line {
    top: 0;
    width: 66%;
}

.middle-line {
    top: 50%;
    transform: translateY(-50%);
}

div.lower-line {
    bottom: 0;
    width: 33%;
}

.mobile-icon.active > div {
    width: 100%;
}

.mobile-icon.active .upper-line {
    transform: translateY(calc(calc(var(--icon-height) / 2) - 50%))
        rotate(135deg);
}

.mobile-icon.active .lower-line {
    transform: translateY(calc(-1 * calc(calc(var(--icon-height) / 2) - 50%)))
        rotate(-135deg);
}

.mobile-icon.active .middle-line {
    opacity: 0;
}

.mug-text {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 10px;
    color: white;
    font-size: 2em;
    text-decoration: none;
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
