'use strict';

const createItem = async (z, bundle) => {
  const res = await z.request({
    url: bundle.authData.host + bundle.authData.webhookEndpoint,
    method: 'POST',
    body: {
      _type: bundle.inputData.type,
      id: bundle.inputData.id,
      title: bundle.inputData.title,
      description: bundle.inputData.description,
      link: bundle.inputData.link,
      date: bundle.inputData.date,
      dueDate: bundle.inputData.dueDate,
      open: bundle.inputData.openExpression,
      assignedTo: bundle.inputData.assignedTo || [],
      roles: bundle.inputData.roles || [],
      properties: bundle.inputData.properties || [],
      teaserImageUrl: bundle.inputData.teaserImageUrl,
      enableDismiss: bundle.inputData.enableDismiss,
      flag: bundle.inputData.flag,
    }
  });

  if (res.status === 200) {
    if (res.json && res.json.ErrorCode === 401) {
      throw new z.errors.RefreshAuthError();
    }

    return {};
  } else if (res.status === 401 || res.status === 403) {
    throw new z.errors.RefreshAuthError();
  } else {
    throw new Error(`Unexpected status code ${res.status} and text: "${res.statusText}"`);
  }
};

module.exports = {
  key: 'items',
  noun: 'Item',
  display: {
    label: 'Create or Update Item',
    description: 'Creates or updates an item.'
  },
  operation: {
    inputFields: [
      {
        key: 'type',
        type: 'string',
        label: 'Card Name',
        required: true,
        helpText: 'Name of the Card this data is for',
        default: 'New Card'
      },
      { key: 'id', label: 'Id', required: false },
      { key: 'title', label: 'Title', required: true },
      { key: 'description', label: 'Description', required: false },
      { key: 'link', label: 'Link', required: false },
      { key: 'date', label: 'Date', required: false },
      { key: 'dueDate', label: 'Due Date', required: false },
      { key: 'openExpression', label: 'Open', required: false },
      { key: 'assignedTo', label: 'Assigned To', list: true, required: false },
      { key: 'teaserImageUrl', label: 'Teaser Image URL', required: false },
      { key: 'enableDismiss', label: "Show 'Dismiss' button", required: false },
      { key: 'flag', label: "Status Flag", required: false },
      { key: 'properties', label: 'Properties', dict: true, required: false },
      {
        key: 'roles',
        label: 'Roles',
        list: true,
        dynamic: 'rolesList.name.title'
      }
    ],
    perform: createItem
  }
};
