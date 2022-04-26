"use strict";

const createItem = async (z, bundle) => {
  const res = await z.request({
    url: bundle.authData.host + bundle.authData.webhookEndpoint,
    method: "POST",
    body: {
      _type: bundle.inputData.type,
      id: bundle.inputData.id,
      title: bundle.inputData.title,
      itemTitle: bundle.inputData.itemTitle,
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
    },
  });

  if (res.status === 200) {
    if (res.json && res.json.ErrorCode === 401) {
      throw new z.errors.RefreshAuthError();
    }

    return {};
  } else if (res.status === 401 || res.status === 403) {
    throw new z.errors.RefreshAuthError();
  } else {
    throw new Error(
      `Unexpected status code ${res.status} and text: "${res.statusText}"`
    );
  }
};

module.exports = {
  key: "items",
  noun: "Item",
  display: {
    label: "Generate new Card entry",
    description: "Adds a new list item to either a new or existing Card on your Board",
  },
  operation: {
    inputFields: [
      {
        key: "title",
        label: "Name of this card",
        type: "string",
        helpText:
          "This will be the title of the Card as you see it on your Board. Digital Assistant will create the Card automatically. Or if you want to add this Zap *to an existing* Card, just match the name with the already existing Card.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "sectionItem",
        label: "Section item",
        type: "copy",
        helpText:
          "### Let's fill your Card with live\nEach time this Zap gets triggered your Card will gain a new item. In the *below* section we're going to map fields from your Trigger to correspond to each field in the list.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "itemTitle",
        label: "Item title",
        type: "string",
        helpText:
          "This will be the main headline for each item, e.g. the title of a news article or the name of a task",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "teaserImageUrl",
        label: "Preview picture",
        type: "string",
        helpText:
          "If your Trigger provides an image URL, e.g. from a news article, you can select it here and the Card will display it",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "description",
        label: "Description",
        type: "string",
        helpText:
          "If your Trigger provides a description, e.g. an excerpt from an article or the description of an issue, this will be shown underneath the title",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "date",
        label: "Date",
        type: "string",
        helpText:
          "If your Trigger provides a create time, select it here. This will show beneath the description of the item.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "link",
        label: "Link",
        type: "string",
        helpText:
          "If your Trigger provides a direct link, select it's URL here. This will show users an 'Open' button that sends the them to the original item.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "flag",
        label: "Flag",
        type: "string",
        helpText:
          "Enter an emoji that will be shown next to the item to indicate its status. For example, you can use '🟢' for positive events, and '🔴' for negative ones.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "enableDismiss",
        label: "Make user dismissable?",
        type: "string",
        helpText:
          "If true, then each item can be removed by the user by clicking a '✕' icon",
        default: "false",
        choices: ["true", "false"],
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        label: "Show only to these user roles",
        helpText:
          "Will show this Card only to the selected roles. Manage roles within the Digital Assistant settings.",
        key: "roles",
        list: true,
        dynamic: "rolesList.name.title",
      },
      {
        key: "taskSection",
        label: "Tasks (section)",
        type: "copy",
        helpText:
          "### Optional: Make the Card actionable for the user\n\nThe *below* section can be used for Triggers that require some kind of response from the user, for example for tasks, tickets or failure reports.\n\nSkip this section, if you just want your Card to be a feed.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "dueDate",
        label: "Due Date",
        type: "string",
        helpText:
          "If your Trigger provides a due date, e.g. a task deadline, you can enter it here and the Card will show it",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "assignedTo",
        label: "Assign to",
        type: "string",
        helpText:
          "If your Trigger provides the email address of the assigned user, select it here. If it matches with the email of a Digital Assistant user, then only they will see the item.",
        required: false,
        list: true,
        altersDynamicFields: false,
      },
      {
        key: "openExpression",
        label: "Noteworthy event?",
        type: "string",
        helpText:
          "true/false. Improves notification behavior of Digital Assistant. Enter 'true' if the user should decide whether the item needs a reaction (e.g. a server stopped responding, new ticket created), or 'false' if it's more informational (e.g. deploy succeeded, ticket has been closed).",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "id",
        label: "ID",
        type: "string",
        helpText:
          "Assign the item a unique ID by selecting a suitable attribute from your Trigger",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "properties",
        label: "Extra properties",
        helpText:
          "Freely define extra pairs of field names and values that can be used to further customize your Adaptive Card (by going to the Designer tool)",
        dict: true,
        required: false,
        altersDynamicFields: false,
      },
    ],
    perform: createItem,
  },
};
