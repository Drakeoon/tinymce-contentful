const openInsertCodeSnippetDialog = function (editor) {
  return editor.windowManager.open({
    title: "Paste your code snippet here",
    body: {
      type: "panel",
      items: [
        {
          type: "alertbanner",
          level: "info",
          text:
            "The code in the editor will look differently than on live website. Use <strong>Preview</strong> button in Contentful to ensure it displays correctly.",
          icon: "info",
        },
        {
          type: "alertbanner",
          level: "success",
          text:
            "<strong>You don't need to fix indentation</strong>, blog will do that for you 🎉. Use Preview to ensure it displays correctly.",
          icon: "code-sample",
        },
        {
          type: "textarea",
          name: "code",
          label: "Code",
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

      const escapedCode = tinymce.html.Entities.encodeRaw(data.code);

      editor.insertContent(`<pre><code>${escapedCode}</code></pre>`);

      api.close();
    },
  });
};

export default openInsertCodeSnippetDialog;
