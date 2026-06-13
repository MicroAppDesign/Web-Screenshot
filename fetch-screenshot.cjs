const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://web-screenshot-six.vercel.app/api/screenshot';

async function takeScreenshot(url, options = {}) {
  const {
    width = 1920,
    height = 1080,
    fullPage = false,
    outputPath = './screenshot.png'
  } = options;

  console.log(`📸 กำลังจับภาพหน้าจอ: ${url}`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        width,
        height,
        fullPage
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Request failed');
    }

    const data = await response.json();
    
    if (!data.imageUrl) {
      throw new Error('No image URL received');
    }

    // ถ้าเป็น base64 data URL
    if (data.imageUrl.startsWith('data:')) {
      const base64Data = data.imageUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ บันทึกภาพที่: ${path.resolve(outputPath)}`);
      return outputPath;
    } 
    // ถ้าเป็น URL ปกติ
    else {
      const imageResponse = await fetch(data.imageUrl);
      const buffer = await imageResponse.buffer();
      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ บันทึกภาพที่: ${path.resolve(outputPath)}`);
      return outputPath;
    }
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    throw error;
  }
}

// ตัวอย่างการใช้งาน
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('ใช้งาน: node fetch-screenshot.cjs <url> [width] [height] [fullPage] [outputPath]');
    console.log('ตัวอย่าง:');
    console.log('  node fetch-screenshot.cjs https://google.com');
    console.log('  node fetch-screenshot.cjs https://google.com 1280 720 true my-screenshot.png');
    process.exit(1);
  }

  const url = args[0];
  const width = args[1] ? parseInt(args[1]) : 1920;
  const height = args[2] ? parseInt(args[2]) : 1080;
  const fullPage = args[3] === 'true' || args[3] === '1';
  const outputPath = args[4] || './screenshot.png';

  takeScreenshot(url, { width, height, fullPage, outputPath })
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = takeScreenshot;
