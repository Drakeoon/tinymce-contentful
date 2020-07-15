import { get } from "lodash";

const { TINYMCE_KEY, TINYMCE_CHANNEL } = process.env;

function loadScript(src, onload) {
  var script = document.createElement("script");
  script.setAttribute("src", src);
  script.onload = onload;
  document.body.appendChild(script);
}

export const loadTinyMCEScript = (api, tinymceForContentful) => {
  var sub =
    location.host == "contentful.staging.tiny.cloud"
      ? "cloud-staging"
      : "cloud";
  var apiKey = get(api, "parameters.installation.apiKey", TINYMCE_KEY);
  var channel = get(api, "parameters.installation.channel", TINYMCE_CHANNEL);
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
};
