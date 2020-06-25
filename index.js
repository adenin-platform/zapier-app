'use strict';

const authentication = require('./authentication');
const itemCreate = require('./creates/item');

// To include the API key on all outbound requests, simply define a function here.
// It runs runs before each request is sent out, allowing you to make tweaks to the request in a centralized spot.
const includeApiKey = (request, z, bundle) => {
  if (bundle.authData.apiKey) {
    request.params = request.params || {};
    //request.params.api_key = bundle.authData.apiKey;
    //
    request.headers['X-APIKEY'] = bundle.authData.apiKey;
    // (If you want to include the key as a header instead)
    //
  }

  return request;
};

// eslint-disable-next-line no-unused-vars
const handleHTTPError = (response, z) => {
  if (response.status >= 400) {
    throw new Error(`Unexpected status code ${response.status}`);
  }

  return response;
};

const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,
  beforeRequest: [
    includeApiKey
  ],
  afterResponse: [
    handleHTTPError
  ],
  resources: {},
  // If you want your trigger to show up, you better include it here!
  triggers: {},
  // If you want your searches to show up, you better include it here!
  searches: {},
  // If you want your creates to show up, you better include it here!
  creates: {
    [itemCreate.key]: itemCreate
  }
};

// Finally, export the app.
module.exports = App;
