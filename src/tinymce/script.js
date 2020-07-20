import { get } from "lodash";

const { TINYMCE_KEY, TINYMCE_CHANNEL } = process.env;

function loadScript(src, onload) {
  const script = document.createElement("script");
  script.setAttribute("src", src);
  script.onload = onload;
  document.body.appendChild(script);
}

export const loadTinyMCEScript = (api = {}, scriptLoadCallback) => {
  const sub =
    location.host == "contentful.staging.tiny.cloud"
      ? "cloud-staging"
      : "cloud";
  const apiKey = get(api, "parameters.installation.apiKey", TINYMCE_KEY);
  const channel = get(api, "parameters.installation.channel", TINYMCE_CHANNEL);
  const tinymceUrl =
    "https://" +
    sub +
    ".tinymce.com/" +
    channel +
    "/tinymce.min.js?apiKey=" +
    apiKey;

  loadScript(tinymceUrl, function () {
    if (scriptLoadCallback) {
      scriptLoadCallback(api);
    }
  });
};
