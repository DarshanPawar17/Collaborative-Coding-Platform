const fs = require("fs");
const { exec } = require("child_process");

let isCommitting = false;
let timeout;

function autoCommit(eventType, filename) {
  if (
    !filename ||
    filename.includes(".git") ||
    filename.includes("node_modules") ||
    filename === "auto-commit.js"
  )
    return;

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    if (isCommitting) return;
    isCommitting = true;

    const safeFilename = filename.replace(/\\/g, "/").replace(/["$`]/g, "");
    const message = `Auto-commit: Updated ${safeFilename}`;
    console.log(`Change detected in ${filename}. Committing and pushing...`);

    exec(
      `git add . && git commit -m "${message}" && git push`,
      (error, stdout, stderr) => {
        if (error) console.error(`Failed to push: ${error.message}`);
        else console.log(`Success! Commit pushed to GitHub: "${message}"`);

        isCommitting = false;
      },
    );
  }, 2000);
}

console.log("Watching for file changes to auto-commit...");
fs.watch(".", { recursive: true }, autoCommit);
