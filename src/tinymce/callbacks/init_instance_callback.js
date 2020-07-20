import { throttle } from "lodash";

export const init_instance_callback = (api) =>
  function (editor) {
    let listening = true;

    function getEditorContent() {
      return editor.getContent() || "";
    }

    function getApiContent() {
      return api.field.getValue() || "";
    }

    function setContent(x) {
      const apiContent = x || "";
      const editorContent = getEditorContent();
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
      const editorContent = getEditorContent();
      const apiContent = getApiContent();

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

    const throttled = throttle(onEditorChange, 500, { leading: true });
    editor.on("change keyup setcontent blur", throttled);
  };
