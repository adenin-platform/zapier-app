const createItem = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: bundle.authData.requestUrl,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      _type: bundle.inputData.type,
      id: bundle.inputData.id,
      title: bundle.inputData.title,
      description: bundle.inputData.description,
      link: bundle.inputData.link,
      date: bundle.inputData.date,
      owner: bundle.inputData.owner,
      assignees: bundle.inputData.assignees
    })
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

module.exports = {
  key: 'items',
  noun: 'Item',

  display: {
    label: 'Create Item',
    description: 'Creates a Item.'
  },

  operation: {
    inputFields: [
      {
        key: "type",
        type: "string",
        label: "Type",
        required: true,
        helpText: "Type of object you are passing.",
        choices: {
          'issue': "Issue",
          'ticket': "Ticket",
          'lead': "Lead"
        }
      },
      { key: 'id', label: 'Id', required: true },
      { key: 'title', label: 'Title', required: true },
      { key: 'description', label: 'Description', required: false },
      { key: 'link', label: 'Link', required: false },
      { key: 'date', label: 'Date', required: false },
      { key: 'owner', label: 'Owner', required: false },
      { key: 'assignees', label: 'Assignees', list: true, required: false }
    ],
    perform: createItem,
  }
};