const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../src/assets');
const destDir = path.resolve(__dirname, 'uploads');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

try {
  const files = fs.readdirSync(srcDir);
  files.forEach(file => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    
    // Copy only images
    if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`Copied ${file} to uploads/`);
    }
  });
  console.log('All asset images copied to server/uploads/ successfully!');
} catch (error) {
  console.error('Error copying assets:', error);
}
