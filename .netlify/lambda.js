const fs = require("fs");
fs.writeFileSync(
  "./.env",
  `TINYMCE_KEY=${process.env.TINYMCE_KEY}\nTINYMCE_CHANNEL=${process.env.TINYMCE_CHANNEL}\n`
);
