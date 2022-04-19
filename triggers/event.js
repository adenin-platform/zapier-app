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

  return z.request(options).then((response) => response.json);
};

const unsubscribeHook = (z, bundle) => {
  const options = {
    url: `${bundle.authData.host}/api/events/unsubscribe/${bundle.subscribeData.Data.EventName}`,
    method: 'DELETE',
  };

  return z.request(options).then((response) => response.json);
};

const getEvent = (z, bundle) => {
  return [
    {
      id: '1',
      name: 'Zapier',
      eventName: 'Example',
    }
  ];
};

const getEvents = (z, bundle) => {
  return [
    {
      id: '1',
      name: 'Zapier',
      eventName: 'Example',
    }
  ];
  /* const options = {
    url: `${bundle.authData.host}/api/events`,
  };

  return z.request(options).then((response) => response.json.Data.items || []); */
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
        required: true
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
      {
        key: 'value1',
        label: 'A custom value.',
      },
      {
        key: 'value2',
        label: 'A custom value.',
      },
      {
        key: 'value3',
        label: 'A custom value.',
      },
      {
        key: 'value4',
        label: 'A custom value.',
      },
      {
        key: 'value5',
        label: 'A custom value.',
      },
      {
        key: 'value6',
        label: 'A custom value.',
      },
      {
        key: 'value7',
        label: 'A custom value.',
      },
      {
        key: 'value8',
        label: 'A custom value.',
      },
      {
        key: 'value9',
        label: 'A custom value.',
      },
    ],
  },
};
