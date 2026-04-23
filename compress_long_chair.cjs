const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcPath = 'C:\\Users\\OS\\Desktop\\UX-UI FURNITURE FLOWCHART\\icon-รูปภาพ\\เก้าอี้ยาว.png';
const destPath = 'C:\\Users\\OS\\Desktop\\UX-UI FURNITURE FLOWCHART\\furniture-configurator\\public\\chair_long.webp';

sharp(srcPath)
  .resize(800)
  .webp({ quality: 80 })
  .toFile(destPath)
  .then(() => console.log('Saved chair_long.webp'))
  .catch(err => console.error(err));
