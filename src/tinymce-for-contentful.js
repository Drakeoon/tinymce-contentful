window.contentfulExtension.init(function(api) {
  function tinymceForContentful(api) {
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
      min_height: 300,
      autoresize_bottom_margin: 15,
      resize: false,
      image_caption: true,
      file_picker_types: "image",
      file_picker_callback: function(cb, value, meta) {
        var input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");

        input.onchange = function() {
          var file = this.files[0];

          const { name: fileName, type: contentType } = file;

          var reader = new FileReader();
          reader.onload = function() {
            const waitMsg = "Please wait...";

            const div = document.createElement("div");
            div.innerHTML = waitMsg;
            div.classList.add("tinymce-loading");

            document.querySelector(".tox-dialog__body").appendChild(div);

            const client = contentfulManagement.createClient({
              accessToken: tweak(
                api.parameters.installation.contentfulManagementApiKey
              )
            });

            client
              .getSpace(tweak(api.parameters.installation.spaceId))
              .then(space =>
                space.createAssetFromFiles({
                  fields: {
                    title: {
                      "en-US": fileName
                    },
                    description: {
                      "en-US": fileName
                    },
                    file: {
                      "en-US": {
                        contentType,
                        fileName,
                        file
                      }
                    }
                  }
                })
              )
              .then(asset => asset.processForAllLocales())
              .then(asset => {
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
      init_instance_callback: function(editor) {
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

        api.field.onValueChanged(function(x) {
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
              .then(function() {
                listening = true;
              })
              .catch(function(err) {
                console.log("Error setting content", err);
                listening = true;
              });
          }
        }

        var throttled = _.throttle(onEditorChange, 500, { leading: true });
        editor.on("change keyup setcontent blur", throttled);
      }
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

  loadScript(tinymceUrl, function() {
    tinymceForContentful(api);
  });
});
