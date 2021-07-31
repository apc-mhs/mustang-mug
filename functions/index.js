const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});

let ssrServerServer;
exports.ssrServer = functions.https.onRequest(async (request, response) => {
    if (!ssrServerServer) {
        functions.logger.info('Initializing SvelteKit SSR Handler');
        ssrServerServer = require('./ssrServer/index').default;
        functions.logger.info('SvelteKit SSR Handler initialised!');
    }

    process.env['TZ'] = 'America/New_York';
    // Pass the functions config variable into process.env
    // so it can be accessed by SvelteKit
    // TODO: Do this for every config variable automatically
    process.env['MSB_API_KEY'] = functions.config().msb.key;
    return await ssrServerServer(request, response);
});

// https://firebase.google.com/docs/auth/admin/custom-claims#logic
exports.processSignUp = functions.auth.user().onCreate(async (user) => {
  // Check if user meets role criteria.
  if (
    user.email &&
    isAdminEmail(user.email) &&
    user.emailVerified
  ) {
    const customClaims = {
      admin: true,
      accessLevel: 10
    };

    try {
      // Set custom user claims on this newly created user.
      await admin.auth().setCustomUserClaims(user.uid, customClaims);
    } catch (error) {
      console.log(error);
    }
  }
});

function isAdminEmail(email) {
    const adminEmails = functions.config().admin.emails.split(',').map((email) => email.toLowerCase());
    return adminEmails.includes(email.toLowerCase());
}
