const subscribeHook = (z, bundle) => {
  const data = {
    url: bundle.targetUrl,
    eventName: bundle.inputData.eventName,
  };

  const options = {
    url: `${bundle.authData.host}/api/events/subscribe`,
    method: 'POST',
    body: data,
  };

  return z.request(options).then((response) => response.data);
};

const unsubscribeHook = (z, bundle) => {
  const options = {
    url: `${bundle.authData.host}/api/events/unsubscribe/${bundle.subscribeData.eventName}`,
    method: 'DELETE',
  };

  return z.request(options).then((response) => response.data);
};

const getEvent = (z, bundle) => {
  const options = {
    url: `${bundle.authData.host}/api/events/${bundle.cleanedRequest.eventName}`,
  };

  return z.request(options).then((response) => [response.data.Data.event]);
};

const getEvents = (z, bundle) => {
  const options = {
    url: `${bundle.authData.host}/api/events`,
  };

  return z.request(options).then((response) => response.data.Data.items || []);
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
    performList: getEvents,
    sample: {
      id: 1,
      eventName: 'New Event',
      name: 'Zapier'
    },
    outputFields: [
      { key: 'id', label: 'ID' },
      { key: 'eventName', label: 'Event Name' },
      { key: 'name', label: 'Event Type' },
      { key: 'url', label: 'URL' }
    ],
  },
};