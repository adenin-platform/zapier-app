'use strict';

const testAuth = async (z, bundle) => {
  const res = await z.request({
    url: bundle.authData.host + '/api/session/myprofile',
    method: 'GET'
  });

  if (res.status === 200) {
    const body = res.json;

    if (body.Data.authenticated) {
      return body;
    }

    throw new z.errors.RefreshAuthError();
  } else if (res.status === 403 || res.status === 401) {
    throw new z.errors.RefreshAuthError();
  } else {
    throw new Error(`Unexpected status code ${res.status} and text: "${res.statusText}"`);
  }
};

const getConnectionLabel = (z, bundle) => {
  return bundle.inputData.Data.Email;
};

module.exports = {
  type: 'oauth2',
  test: testAuth,
  connectionLabel: getConnectionLabel,
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
      url: '{{bundle.authData.host}}/oauth2/token',
      body: {
        refresh_token: '{{bundle.authData.refresh_token}}',
        client_id: '{{process.env.CLIENT_ID}}',
        client_secret: '{{process.env.CLIENT_SECRET}}',
        redirect_uri: '{{bundle.authData.redirect_uri}}',
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
    {
      key: 'host',
      type: 'string',
      required: false,
      default: 'https://app.adenin.com',
      helpText: 'Leave as https://app.adenin.com, unless your [plan](https://www.adenin.com/digital-assistant/pricing/#self-managed) includes a custom domain. **Don\'t have a Digital Assistant account yet? [Create one for free](https://www.adenin.com/register/)**'
    }
  ],
};
