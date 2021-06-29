import { sleep } from '$lib/utils';
import { cubicInOut } from 'svelte/easing';
import { tweened } from 'svelte/motion';

const progress = tweened(0, { duration: 350, easing: cubicInOut });

let loading = false;

async function startLoading() {
    loading = true;

    progress.set(25);
    for (let i = 0; i < 25; i++) {
        if (!loading) break;
        progress.update((progress) => progress + 2);
        await sleep(500);
    }
}

async function stopLoading() {
    loading = false;

    progress.set(100);
    await sleep(500);
    progress.set(0, { duration: 0 });
}

export default { subscribe: progress.subscribe };

export {
    startLoading,
    stopLoading
}
