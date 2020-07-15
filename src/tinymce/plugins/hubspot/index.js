export const initHubspotPlugin = () => {
  tinymce.PluginManager.add("hubspot", function (editor, url) {
    var openInsertScriptDialog = function () {
      return editor.windowManager.open({
        title: "Paste Hub Spot script",
        body: {
          type: "panel",
          items: [
            {
              type: "textarea",
              name: "script",
              label: "Script",
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
          editor.insertContent(data.script);
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
          editor.insertContent(`<pre><code>${data.code}<code></pre>`);
          api.close();
        },
      });
    };

    // Add a button that opens a window
    editor.ui.registry.addMenuButton("hubspot", {
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
