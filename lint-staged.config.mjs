import path from "node:path";

const quote = (value) => `"${value.replaceAll('"', '\\"')}"`;

const relativeTo = (directory, files) =>
  files.map((file) => quote(path.relative(directory, file))).join(" ");

const rootFiles = (files) => {
  const matchedFiles = files.filter((file) => {
    const relativePath = path.relative(process.cwd(), file);

    return !relativePath.startsWith("frontend/") && !relativePath.startsWith("backend/");
  });

  if (matchedFiles.length === 0) {
    return [];
  }

  return `prettier --write --ignore-unknown ${matchedFiles.map(quote).join(" ")}`;
};

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

  "*.{json,md,yml,yaml}": rootFiles,
};
