// create-crud.js
const fs = require("fs");
const path = require("path");

const objectName = process.argv[2];
if (!objectName) {
  console.error("❌ Iltimos object nomini kiriting.");
  process.exit(1);
}

const kebabCase = objectName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const snakeCase = kebabCase.replace(/-/g, "_");
const folderName = `${objectName}s`;
const pascalCase = objectName.charAt(0).toUpperCase() + objectName.slice(1);
const upsertComponentName = `Upsert${pascalCase}`;
const targetDir = path.join("src", "views", "pages", folderName);
fs.mkdirSync(targetDir, { recursive: true });

// Helper: Replace placeholders
function renderTemplate(template, replacements) {
  return template.replace(/\$(\w+)\$/g, (_, key) => replacements[key] || "");
}

// Load template files
const indexTemplate = fs.readFileSync("templates/Index.vue", "utf-8");
const upsertTemplate = fs.readFileSync("templates/Upsert.vue", "utf-8");

// Replace placeholders
const indexFinal = renderTemplate(indexTemplate, {
  OBJECT_NAME: objectName,
  KEBAB_NAME: kebabCase,
  SNAKE_NAME: snakeCase,
  UPSERT_COMPONENT: upsertComponentName,
});

const upsertFinal = renderTemplate(upsertTemplate, {
  OBJECT_NAME: objectName,
  KEBAB_NAME: kebabCase,
  SNAKE_NAME: snakeCase,
});

// Write output
fs.writeFileSync(path.join(targetDir, "Index.vue"), indexFinal);
fs.writeFileSync(path.join(targetDir, `${upsertComponentName}.vue`), upsertFinal);

console.log(`✅ CRUD sahifa yaratildi: src/views/pages/${folderName}/`);
