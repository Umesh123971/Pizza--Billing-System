const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'package.json');
const backupPath = pkgPath + '.bak';

function sanitize(raw) {
  raw = raw.replace(/^\uFEFF/, '');
  raw = raw.replace(/\/\/[^\n\r]*/g, '');
  raw = raw.replace(/\/\*[\s\S]*?\*\//g, '');
  raw = raw.replace(/,\s*([\]}])/g, '$1');
  return raw;
}

try {
  if (!fs.existsSync(pkgPath)) {
    console.error('package.json not found at', pkgPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(pkgPath, 'utf8');

  try {
    JSON.parse(raw);
    console.log('package.json is already valid JSON; no changes made.');
    process.exit(0);
  } catch (_) {
    console.log('Invalid JSON detected, attempting automatic fix...');
  }

  fs.copyFileSync(pkgPath, backupPath);
  const fixedText = sanitize(raw);

  let parsed;
  try {
    parsed = JSON.parse(fixedText);
  } catch (finalErr) {
    console.error('Automatic fixes failed. Original saved to', backupPath);
    console.error('Parsing error:', finalErr.message);
    process.exit(2);
  }

  fs.writeFileSync(pkgPath, JSON.stringify(parsed, null, 2) + '\n', 'utf8');
  console.log('✓ package.json fixed! Original saved to', backupPath);
  process.exit(0);
} catch (err) {
  console.error('Unexpected error:', err.message || err);
  process.exit(3);
}
