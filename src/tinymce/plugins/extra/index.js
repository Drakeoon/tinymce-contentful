import openInsertCodeSnippetDialog from "./openInsertCodeSnippetDialog";
import openInsertCodepenEmbed from "./openInsertCodepenEmbed";
import openInsertHubSpotScript from "./openInsertHubSpotScript";

export const initExtraPlugin = () => {
  tinymce.PluginManager.add("extra", function (editor, url) {
    editor.ui.registry.addMenuButton("extra", {
      text: "Insert Extra",
      fetch: function (callback) {
        var items = [
          {
            type: "menuitem",
            text: "Insert HubSpot script",
            onAction: function () {
              openInsertHubSpotScript(editor);
            },
          },
          {
            type: "menuitem",
            text: "Insert CodePen dynamic segment",
            onAction: function () {
              openInsertCodepenEmbed(editor);
            },
          },
          {
            type: "menuitem",
            text: "Insert code snippet",
            onAction: function () {
              openInsertCodeSnippetDialog(editor);
            },
          },
        ];

        callback(items);
      },
    });

    return {
      getMetadata: function () {
        return {
          name: "extra",
        };
      },
    };
  });
};
