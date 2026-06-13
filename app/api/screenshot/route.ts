import { NextResponse } from 'next/server';

// ตรวจสอบว่าอยู่บน Vercel หรือไม่
const isVercel = process.env.VERCEL === '1' || process.env.NEXT_PUBLIC_VERCEL === '1';

export async function POST(request: Request) {
  try {
    const { url, width = 1920, height = 1080, fullPage = false } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let validUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      validUrl = 'https://' + url;
    }

    if (isVercel) {
      // บน Vercel: ใช้บริการฟรีเพื่อความเร็วและเชื่อถือได้
      const screenshotUrl = `https://api.screenshotmachine.com?key=demo&url=${encodeURIComponent(validUrl)}&dimension=${width}x${height}&format=png&cacheLimit=0`;
      return NextResponse.json({ imageUrl: screenshotUrl });
    } else {
      // บน Local: ใช้ Puppeteer จับภาพโดยตรง
      const puppeteer = require('puppeteer');
      let browser;
      
      try {
        browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const page = await browser.newPage();
        await page.setViewport({ 
          width: parseInt(width), 
          height: parseInt(height),
          deviceScaleFactor: 1
        });
        
        await page.goto(validUrl, { 
          waitUntil: 'networkidle2', 
          timeout: 60000 
        });
        
        await new Promise(resolve => setTimeout(resolve, 3000));

        const screenshot = await page.screenshot({ 
          fullPage: fullPage,
          encoding: 'base64',
          type: 'png'
        });

        await browser.close();

        return NextResponse.json({ 
          imageUrl: `data:image/png;base64,${screenshot}` 
        });
      } catch (puppeteerError) {
        if (browser) await browser.close();
        throw puppeteerError;
      }
    }
  } catch (error) {
    console.error('Screenshot error:', error);
    return NextResponse.json({ error: 'Failed to capture screenshot' }, { status: 500 });
  }
}