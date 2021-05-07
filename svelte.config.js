const firebaseAdapter = require("svelte-adapter-firebase");

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: firebaseAdapter()
	}
};

export default config;
