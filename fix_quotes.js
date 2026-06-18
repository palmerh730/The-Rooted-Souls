const fs = require('fs');
const path = require('path');

const fixFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Fix strings that open with a backtick but end with a double quote
  const regexDoubleQuote = /\`\$\{import\.meta\.env\.VITE_API_URL \|\| ""\}\/api\/([^"]*)\"/g;
  content = content.replace(regexDoubleQuote, '`${import.meta.env.VITE_API_URL || ""}/api/$1`');

  // Fix strings that open with a backtick but end with a single quote
  const regexSingleQuote = /\`\$\{import\.meta\.env\.VITE_API_URL \|\| ""\}\/api\/([^']*)\'/g;
  content = content.replace(regexSingleQuote, '`${import.meta.env.VITE_API_URL || ""}/api/$1`');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${filePath}`);
  }
};

const directories = ['src/components', 'src/pages/admin', 'src/contexts'];

directories.forEach(dir => {
  const fullDir = path.join(__dirname, dir);
  if (fs.existsSync(fullDir)) {
    fs.readdirSync(fullDir).forEach(file => {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        fixFile(path.join(fullDir, file));
      }
    });
  }
});
