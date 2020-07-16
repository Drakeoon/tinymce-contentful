import { initExtraPlugin } from "./plugins";
import { file_picker_callback, init_instance_callback } from "./callbacks";

const initTinyMCE = (api, initOptions) => {
  const { toolbar, menubar, plugins, accessToken, space } = initOptions;

  // initialise plugins
  initExtraPlugin(api);

  // initialise TinyMCE main instance
  const contentCss =
    process.env.NODE_ENV === "development"
      ? "/custom_content_css.css"
      : "/dist/custom_content_css.css";

  tinymce.init({
    selector: "#editor",
    plugins: plugins,
    toolbar,
    menubar,
    max_height: 800,
    min_height: 600,
    autoresize_bottom_margin: 15,
    resize: false,
    image_caption: true,
    entity_encoding: "named",
    extended_valid_elements: "script[src|async|defer|type|charset]",
    file_picker_types: "image",
    file_picker_callback: file_picker_callback(space, accessToken),
    init_instance_callback: init_instance_callback(api),
    content_css: `${contentCss}?${new Date().getTime()}`,
  });
};

export default initTinyMCE;
