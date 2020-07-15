export const initExtraPlugin = () => {
  tinymce.PluginManager.add("extra", function (editor, url) {
    var openInsertScriptDialog = function () {
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
          var data = api.getData();
          // Insert content when the window form is submitted
          editor.insertContent(data["pasted-script"]);
          api.close();
        },
      });
    };

    var openPasteSnippetDialog = function () {
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
              level: "info",
              text:
                "<strong>You don't need to fix indentation</strong>, blog will do that for you :-). Use Preview to ensure it displays correctly.",
              icon: "info",
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
          var data = api.getData();

          editor.insertContent(`<pre><code>${data.code}</code></pre>`);
          editor.insertContent("<p></p>");
          api.close();
        },
      });
    };

    // Add a button that opens a window
    editor.ui.registry.addMenuButton("extra", {
      text: "Extra",
      fetch: function (callback) {
        var items = [
          {
            type: "menuitem",
            text: "Insert script (Codepen, Hubspot)",
            onAction: function () {
              // Open window
              openInsertScriptDialog();
            },
          },
          {
            type: "menuitem",
            text: "Insert code",
            onAction: function () {
              openPasteSnippetDialog();
            },
          },
        ];

        callback(items);
      },
    });

    return {
      getMetadata: function () {
        return {
          name: "HubSpot",
          url: "http://exampleplugindocsurl.com",
        };
      },
    };
  });
};
