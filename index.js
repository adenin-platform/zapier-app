'use strict';

const authentication = require('./authentication');
const itemCreate = require('./creates/item');
const eventTrigger = require('./triggers/event');

const addBearerHeader = (request, z, bundle) => {
  if (bundle.authData && bundle.authData.access_token) {
    request.headers.Authorization = `Bearer ${bundle.authData.access_token}`;
  }

  return request;
};

const handleHTTPError = (response, z) => {
  if (response.status >= 400) {
    throw new Error(`Unexpected status code ${response.status}`);
  }

  if (response.json && (response.json.ErrorCode === 401)) {
    throw new z.errors.RefreshAuthError();
  }

  return response;
};

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,
  beforeRequest: [
    addBearerHeader
  ],
  afterResponse: [
    handleHTTPError
  ],
  resources: {
    project: {
      key: 'roles',
      noun: 'Roles',
      list: {
        display: {
          label: 'Show roles',
          description: 'Show available roles.',
        },
        operation: {
          perform: async (z, bundle) => {
            const response = await z.request(bundle.authData.host + `/api/roles/lookup`);
            return response.json.Data.items;
          },
        },
      },
    }
  },
  triggers: {
    [eventTrigger.key]: eventTrigger
  },
  searches: {},
  creates: {
    [itemCreate.key]: itemCreate
  }
};

module.exports = App;
