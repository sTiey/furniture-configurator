const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\OS\\Desktop\\UX-UI FURNITURE FLOWCHART\\furniture-configurator\\public';

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.png')) {
    const inputPath = path.join(dir, file);
    const outputPath = path.join(dir, file.replace('.png', '.webp'));
    console.log(`Compressing ${file}...`);
    sharp(inputPath)
      .resize(800)
      .webp({ quality: 80 })
      .toFile(outputPath)
      .then(() => {
        console.log(`Saved ${outputPath}`);
      })
      .catch(err => {
        console.error(`Error on ${file}:`, err);
      });
  }
});
