import { get } from "lodash";

import initTinyMCE from "./tinymce";
import { loadTinyMCEScript } from "./tinymce/script";
import {
  defaultToolbar,
  defaultMenubar,
  defaultPlugins,
} from "./tinymce/defaults";
import { tweak } from "./tools";

document.addEventListener("DOMContentLoaded", function () {
  if (process.env.NODE_ENV === "development") {
    const initOptions = {
      toolbar: defaultToolbar,
      menubar: defaultMenubar,
      plugins: defaultPlugins,
    };

    initTinyMCE(null, initOptions);

    return;
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

    loadTinyMCEScript(api, tinymceForContentful);
  });
});
