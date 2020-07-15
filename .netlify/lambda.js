const fs = require("fs");

const generateEnvFile = () => {
  try {
    fs.readFileSync("./.env", "utf-8");

    console.log("Found local .env files, skipped creating the .env file");
  } catch (err) {
    fs.writeFileSync(
      "./.env",
      `TINYMCE_KEY=${process.env.TINYMCE_KEY}\nTINYMCE_CHANNEL=${process.env.TINYMCE_CHANNEL}\n`
    );

    console.log("Successfully written .env files to CI");
  }
};

generateEnvFile();
