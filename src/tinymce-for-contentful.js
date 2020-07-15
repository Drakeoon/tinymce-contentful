import initTinyMCE from "./tinymce";
import { get } from "lodash";
import {
  defaultToolbar,
  defaultMenubar,
  defaultPlugins,
} from "./tinymce/defaults";

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

window.contentfulExtension.init(function (api) {
  const toolbar = tweak(
    get(api, "parameters.instance.toolbar", defaultToolbar)
  );
  const menubar = tweak(
    get(api, "parameters.instance.menubar", defaultMenubar)
  );

  const plugins = tweak(
    get(api, "parameters.instance.menubar", defaultPlugins)
  );

  const accessToken = tweak(
    get(api, "parameters.installation.contentfulManagementApiKey")
  );

  const space = tweak(get(api, "parameters.installation.spaceId"));

  function tinymceForContentful(api) {
    api.window.startAutoResizer();

    const initOptions = {
      toolbar,
      menubar,
      accessToken,
      space,
      plugins,
    };

    initTinyMCE(api, initOptions);
  }
});
