const openInsertHubSpotScript = function (editor) {
  return editor.windowManager.open({
    title: "Paste in the Hub Spot script",
    body: {
      type: "panel",
      items: [
        {
          type: "alertbanner",
          level: "warn",
          text:
            "<strong>Be careful!</strong> Scripts inserted here <strong>will be executed</strong> on the blog post page. You need to be <strong>fully sure</strong> about the script origin.",
          icon: "warning",
        },
        {
          type: "textarea",
          name: "pasted-script",
          label: "Script",
          maximized: true,
        },
      ],
    },
    buttons: [
      {
        type: "cancel",
        text: "Close",
      },
      {
        type: "submit",
        text: "Insert",
        primary: true,
      },
    ],
    onSubmit: function (api) {
      const data = api.getData();

      editor.insertContent(data["pasted-script"]);

      api.close();
    },
  });
};

export default openInsertHubSpotScript;
