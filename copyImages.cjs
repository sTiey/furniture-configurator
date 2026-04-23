const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\OS\\Desktop\\UX-UI FURNITURE FLOWCHART\\icon-รูปภาพ';
const destDir = 'C:\\Users\\OS\\Desktop\\UX-UI FURNITURE FLOWCHART\\furniture-configurator\\public';

const mapping = {
  'ซุ้ม.png': 'arch.png',
  'ถังขยะ.png': 'trash.png',
  'ที่เก็บสายยาง.png': 'hose.png',
  'เก้าอี้สั้น.png': 'chair.png',
  'โต๊ะ.png': 'table.png'
};

fs.readdirSync(srcDir).forEach(file => {
  if (mapping[file]) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, mapping[file]));
  }
});
