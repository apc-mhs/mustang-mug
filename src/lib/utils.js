import { browser } from "$app/env";
import { readable } from "svelte/store";

function navigateBack(e) {
    if (e) {
        e.preventDefault();
    }
    history.back();
}

function sleep(millis) {
    return new Promise((resolve, _) => setTimeout(resolve, millis));
}

const numberFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const mediaQueries = {};

/** @returns {import("svelte/store").Readable<boolean>} */
function useMediaQuery(mediaQuery) {
    if (!browser) {
        return readable(false, () => {});
    }

    if (mediaQuery in mediaQueries) {
        return mediaQueries[mediaQuery];
    }

    const mediaQueryListener = window.matchMedia(mediaQuery);
    const store = readable(mediaQueryListener.matches, (set) => {
        function queryListener(e) {
            set(e.matches);
        }

        mediaQueryListener.addEventListener('change', queryListener);

        return () => {
            mediaQueryListener.removeEventListener('change', queryListener);
        };
    });
    mediaQueries[mediaQuery] = store;

    return store;
}

export {
    navigateBack,
    sleep,
    numberFormatter,
    useMediaQuery
}
