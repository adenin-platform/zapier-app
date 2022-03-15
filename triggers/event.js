const subscribeHook = (z, bundle) => {
  const data = {
    url: bundle.targetUrl,
    eventName: bundle.inputData.eventName,
  };

  const options = {
    url: `${bundle.authData.host}/api/subscribe`,
    method: 'POST',
    body: data,
  };

  return z.request(options).then((response) => response.data);
};

const unsubscribeHook = (z, bundle) => {
  const hookId = bundle.subscribeData.id;

  const options = {
    url: `${bundle.authData.host}/api/unsubscribe/${hookId}`,
    method: 'DELETE',
  };

  return z.request(options).then((response) => response.data);
};

const getEvent = (z, bundle) => {
  const event = {
    id: bundle.cleanedRequest.id,
    eventName: bundle.cleanedRequest.eventName
  };

  return [event];
};

const getFallbackRealEvent = (z, bundle) => {
  /* const options = {
    url: 'https://57b20fb546b57d1100a3c405.mockapi.io/api/recipes/',
    params: {
      style: bundle.inputData.style,
    },
  };

  return z.request(options).then((response) => response.data); */
  return [getEvent(z, bundle)];
};

module.exports = {
  key: 'event',
  noun: 'Event',
  display: {
    label: 'New Event',
    description: 'Trigger when a named event fires.',
  },
  operation: {
    inputFields: [
      {
        key: 'eventName',
        type: 'string',
        helpText: 'The name of the event.',
      },
    ],
    type: 'hook',
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    perform: getEvent,
    performList: getFallbackRealEvent,
    sample: {
      id: 1,
      eventName: 'New Event'
    },
    outputFields: [
      { key: 'id', label: 'ID' },
      { key: 'createdAt', label: 'Created At' },
      { key: 'name', label: 'Name' },
      { key: 'directions', label: 'Directions' },
      { key: 'authorId', label: 'Author ID' },
      { key: 'style', label: 'Style' },
    ],
  },
};