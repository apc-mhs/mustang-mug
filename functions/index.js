const functions = require('firebase-functions');

let ssrServerServer;
exports.ssrServer = functions.https.onRequest(async (request, response) => {
    if (!ssrServerServer) {
        functions.logger.info('Initializing SvelteKit SSR Handler');
        ssrServerServer = require('./ssrServer/index').default;
        functions.logger.info('SvelteKit SSR Handler initialised!');
    }

    // Pass the functions config variable into process.env
    // so it can be accessed by SvelteKit
    // TODO: Do this for every config variable automatically
    process.env['MSB_API_KEY'] = functions.config().msb.key;
    return await ssrServerServer(request, response);
});
