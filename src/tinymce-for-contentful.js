window.contentfulExtension.init(function (api) {
  function tinymceForContentful(api) {
    tinymce.PluginManager.add("hubspot", function (editor, url) {
      var openDialog = function () {
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

      // Add a button that opens a window
      editor.ui.registry.addMenuButton("hubspot", {
        text: "Extra",
        onAction: function () {
          // Open window
          openDialog();
        },
      });

      // Adds a menu item, which can then be included in any menu via the menu/menubar configuration
      editor.ui.registry.addMenuItem("hubspot-script", {
        text: "Insert HubSpot script",
        onAction: function () {
          // Open window
          openDialog();
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

    editor.ui.registry.addMenuItem("hubspot-codepen", {
      text: "Paste code snippet",
      onAction: function () {
        // Open window
        openDialog();
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

    api.window.startAutoResizer();

    function tweak(param) {
      var t = param.trim();
      if (t === "false") {
        return false;
      } else if (t === "") {
        return undefined;
      } else {
        return t;
      }
    }

    var tb = tweak(api.parameters.instance.toolbar);
    var mb = tweak(api.parameters.instance.menubar);

    tinymce.init({
      selector: "#editor",
      plugins: api.parameters.instance.plugins,
      toolbar: tb,
      menubar: mb,
      max_height: 800,
      min_height: 600,
      autoresize_bottom_margin: 15,
      resize: false,
      image_caption: true,
      extended_valid_elements: "script[src|async|defer|type|charset]",
      file_picker_types: "image",
      file_picker_callback: function (cb, value, meta) {
        var input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");

        input.onchange = function () {
          var file = this.files[0];

          const { name: fileName, type: contentType } = file;

          var reader = new FileReader();
          reader.onload = function () {
            const waitMsg = "Please wait...";

            const div = document.createElement("div");
            div.innerHTML = waitMsg;
            div.classList.add("tinymce-loading");

            document.querySelector(".tox-dialog__body").appendChild(div);

            const client = contentfulManagement.createClient({
              accessToken: tweak(
                api.parameters.installation.contentfulManagementApiKey
              ),
            });

            client
              .getSpace(tweak(api.parameters.installation.spaceId))
              .then((space) =>
                space.createAssetFromFiles({
                  fields: {
                    title: {
                      "en-US": fileName,
                    },
                    description: {
                      "en-US": fileName,
                    },
                    file: {
                      "en-US": {
                        contentType,
                        fileName,
                        file,
                      },
                    },
                  },
                })
              )
              .then((asset) => asset.processForAllLocales())
              .then((asset) => {
                const { url } = asset.fields.file["en-US"];
                const title = asset.fields.title["en-US"];

                asset.publish().then(() => cb(url, { title }));

                div.remove();
              });
          };

          reader.readAsDataURL(file);
        };

        input.click();
      },
      init_instance_callback: function (editor) {
        var listening = true;

        function getEditorContent() {
          return editor.getContent() || "";
        }

        function getApiContent() {
          return api.field.getValue() || "";
        }

        function setContent(x) {
          var apiContent = x || "";
          var editorContent = getEditorContent();
          if (apiContent !== editorContent) {
            //console.log('Setting editor content to: [' + apiContent + ']');
            editor.setContent(apiContent);
          }
        }

        setContent(api.field.getValue());

        api.field.onValueChanged(function (x) {
          if (listening) {
            setContent(x);
          }
        });

        function onEditorChange() {
          var editorContent = getEditorContent();
          var apiContent = getApiContent();

          if (editorContent !== apiContent) {
            //console.log('Setting content in api to: [' + editorContent + ']');
            listening = false;
            api.field
              .setValue(editorContent)
              .then(function () {
                listening = true;
              })
              .catch(function (err) {
                console.log("Error setting content", err);
                listening = true;
              });
          }
        }

        var throttled = _.throttle(onEditorChange, 500, { leading: true });
        editor.on("change keyup setcontent blur", throttled);
      },
    });
  }

  function loadScript(src, onload) {
    var script = document.createElement("script");
    script.setAttribute("src", src);
    script.onload = onload;
    document.body.appendChild(script);
  }

  var sub =
    location.host == "contentful.staging.tiny.cloud"
      ? "cloud-staging"
      : "cloud";
  var apiKey = api.parameters.installation.apiKey;
  var channel = api.parameters.installation.channel;
  var tinymceUrl =
    "https://" +
    sub +
    ".tinymce.com/" +
    channel +
    "/tinymce.min.js?apiKey=" +
    apiKey;

  loadScript(tinymceUrl, function () {
    tinymceForContentful(api);
  });
});
