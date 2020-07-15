const fs = require("fs");

const generateEnvFile = () => {
  const envFile = fs.readFileSync("./.env", "utf-8");

  if (envFile) {
    return;
  }

  fs.writeFileSync(
    "./.env",
    `TINYMCE_KEY=${process.env.TINYMCE_KEY}\nTINYMCE_CHANNEL=${process.env.TINYMCE_CHANNEL}\n`
  );
};

generateEnvFile();
