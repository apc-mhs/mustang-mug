import firebaseAdapter from 'svelte-adapter-firebase';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: firebaseAdapter(),
		prerender: {
			enabled: false
		}
	}
};

export default config;
