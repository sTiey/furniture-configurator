const obj2gltf = require('obj2gltf');
const fs = require('fs');
const path = require('path');

const convert = async (inPath, outPath) => {
    try {
        if (!fs.existsSync(inPath)) {
            console.error(`File not found: ${inPath}`);
            return;
        }
        console.log(`Starting conversion: ${path.basename(inPath)}`);
        const gltf = await obj2gltf(inPath, { binary: true });
        fs.writeFileSync(outPath, gltf);
        console.log(`Successfully converted to ${path.basename(outPath)}`);
    } catch (e) {
        console.error(`Error converting ${inPath}`, e);
    }
};

(async () => {
    const baseDir = 'C:\\Users\\OS\\Desktop\\UX-UI FURNITURE FLOWCHART';
    const outDir = path.join(baseDir, 'furniture-configurator', 'public', 'models');
    
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    // Chair Short
    await convert(
      path.join(baseDir, 'ไฟล์ obj', 'เก้าอี้สนามเดี่ยว', 'เก้าอี้สนามเดี่ยว.obj'), 
      path.join(outDir, 'chair_short.glb')
    );
                  
    // Chair Long
    await convert(
      path.join(baseDir, 'ไฟล์ obj', 'เก้าอี้สนามยาว', 'เก้าอี้สนามยาว.obj'), 
      path.join(outDir, 'chair_long.glb')
    );
                  
    // Table
    await convert(
      path.join(baseDir, 'ไฟล์ obj', 'โต๊ะสนาม', 'โต๊ะสนาม.obj'), 
      path.join(outDir, 'table.glb')
    );
                  
    // Hose
    await convert(
      path.join(baseDir, 'ไฟล์ obj', 'เสาแขวนสายยาง', 'เสาแขวนสายยางสนาม.obj'), 
      path.join(outDir, 'hose.glb')
    );
    
    console.log("All conversions ended.");
})();
