'use strict';

const fetch = require('node-fetch');

const testAuth = async (z, bundle) => {
  // Normally you want to make a request to an endpoint that is either specifically designed to test auth, or one that
  // every user will have access to, such as an account or profile endpoint like /me.
  // In this example, we'll hit httpbin, which validates the Authorization Header against the arguments passed in the URL path

  // This method can return any truthy value to indicate the credentials are valid.
  // Raise an error to show
  const res = await fetch(bundle.authData.requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-apikey': bundle.authData.apiKey
    },
    body: JSON.stringify({
      _type: 'validate_key'
    })
  });

  if (res.status === 200) {
    // we have to return some object, event if it is empty, its expected
    // ref: https://stackoverflow.com/a/51933850
    return {};
  } else if (res.status === 403) {
    throw new Error('The API Key you supplied is invalid');
  } else {
    throw new Error(`Unexpected status code ${res.status} and text: "${res.statusText}"`);
  }
};

module.exports = {
  type: 'custom',
  // Define any auth fields your app requires here. The user will be prompted to enter this info when
  // they connect their account.
  fields: [
    {key: 'apiKey', label: 'API Key', required: true, type: 'string'},
    {key: 'requestUrl', label: 'Webhook Receiver URL', required: true, type: 'string'}
  ],
  // The test method allows Zapier to verify that the credentials a user provides are valid. We'll execute this
  // method whenver a user connects their account for the first time.
  test: testAuth
  // assuming "username" is a key in the json returned from testAuth
  /*
  connectionLabel: (z, bundle) => {
    return bundle.inputData.username;
  }
  */
};
