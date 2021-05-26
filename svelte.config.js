import firebaseAdapter from 'svelte-adapter-firebase';
import preprocess from 'svelte-preprocess';

const dev = process.env['NODE_ENV'] === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: firebaseAdapter(),
		prerender: {
			enabled: false
		},
		hostHeader: !dev ? 'X-Forwarded-Host' : undefined
	}
};

export default config;
