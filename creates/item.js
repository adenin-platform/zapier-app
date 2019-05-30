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
      dueDate: bundle.inputData.dueDate,
      openValue: doEval(bundle.inputData.openExpression),
      assignedTo: bundle.inputData.assignedTo,
      roles: bundle.inputData.roles
    })
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};
function doEval(expression) {
  try {
    return eval(expression);
  } catch (error) {
    console.log(error);
  }
  return true;
}
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
      { key: 'dueDate', label: 'Due Date', required: false },
      { key: 'openExpression', label: 'Open Expression', required: false },
      { key: 'assignedTo', label: 'Assigned To', list: true, required: false },
      { key: 'roles', label: 'Roles', list: true, required: false }
    ],
    perform: createItem,
  }
};
