'use strict';

const testAuth = async (z, bundle) => {
  const res = await z.request({
    url: bundle.authData.host + '/api/session/myprofile',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + bundle.authData.access_token
    }
  });

  if (res.status === 200) {
    const body = res.json;

    if (body.Data.authenticated) {
      return {};
    }

    throw new z.errors.RefreshAuthError();
  } else if (res.status === 403) {
    throw new Error('The API Key you supplied is invalid');
  } else {
    throw new Error(`Unexpected status code ${res.status} and text: "${res.statusText}"`);
  }
};

module.exports = {
  type: 'oauth2',
  test: testAuth,
  oauth2Config: {
    authorizeUrl: {
      method: 'GET',
      url: '{{bundle.inputData.host}}/oauth2/authorize',
      params: {
        client_id: '{{process.env.CLIENT_ID}}',
        state: '{{bundle.inputData.state}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        response_type: 'code',
      },
    },
    getAccessToken: {
      method: 'POST',
      url: '{{bundle.inputData.host}}/oauth2/token',
      body: {
        code: '{{bundle.inputData.code}}',
        client_id: '{{process.env.CLIENT_ID}}',
        client_secret: '{{process.env.CLIENT_SECRET}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        grant_type: 'authorization_code',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
    refreshAccessToken: {
      method: 'POST',
      url: '{{bundle.inputData.host}}/oauth2/token',
      body: {
        refresh_token: '{{bundle.authData.refresh_token}}',
        client_id: '{{process.env.CLIENT_ID}}',
        client_secret: '{{process.env.CLIENT_SECRET}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        grant_type: 'refresh_token',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
    autoRefresh: true,
    scope: '',
  },
  fields: [
    { key: 'host', type: 'string', required: true, default: 'https://app.adenin.com' },
    { key: 'webhookEndpoint', type: 'string', required: true, default: '/webhook-receiver' }
  ],
};
