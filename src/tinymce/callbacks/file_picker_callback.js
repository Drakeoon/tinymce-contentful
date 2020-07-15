import { throttle, get } from "lodash";

export const file_picker_callback = (space, accessToken) =>
  function (cb, value, meta) {
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
          accessToken,
        });

        client
          .getSpace(space)
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
  };
