const openInsertCodepenEmbed = function (editor) {
  return editor.windowManager.open({
    title: "Paste in the Codepen embed iframe code",
    body: {
      type: "panel",
      items: [
        {
          type: "alertbanner",
          level: "info",
          text: `We have a <a href="gitbook_url_here" target="_blank" rel="noopener noreferrer">guide</a> for inserting Codepen snippets, check it out if you have trouble with embedding code segments.`,
          icon: "info",
        },
        {
          type: "textarea",
          name: "pasted-embed-code",
          label: "Iframe embed code",
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

      editor.insertContent(data["pasted-embed-code"]);
      editor.insertContent("<p></p>");

      api.close();
    },
  });
};

export default openInsertCodepenEmbed;
