import path from "node:path";

const quote = (value) => `"${value.replaceAll('"', '\\"')}"`;

const relativeTo = (directory, files) =>
  files.map((file) => quote(path.relative(directory, file))).join(" ");

export default {
  "frontend/**/*.{ts,tsx,js,jsx,mjs,json,css,md}": (files) =>
    `bash -lc 'cd frontend && prettier --write --ignore-unknown ${relativeTo(
      "frontend",
      files,
    )}'`,

  "backend/**/*.{ts,js,mjs,json,md}": (files) =>
    `bash -lc 'cd backend && prettier --write --ignore-unknown ${relativeTo(
      "backend",
      files,
    )}'`,

  "*.{json,md,yml,yaml}": (files) =>
    `prettier --write --ignore-unknown ${files.map(quote).join(" ")}`,
};
