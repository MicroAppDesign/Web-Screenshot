import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {
  let browser;
  try {
    const { url, width = 1920, height = 1080, fullPage = false } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let validUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      validUrl = 'https://' + url;
    }

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: parseInt(width), height: parseInt(height) });
    await page.goto(validUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    const screenshot = await page.screenshot({ 
      fullPage: fullPage,
      encoding: 'base64'
    });

    await browser.close();

    return NextResponse.json({ 
      imageUrl: `data:image/png;base64,${screenshot}` 
    });
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    return NextResponse.json({ error: 'Failed to capture screenshot' }, { status: 500 });
  }
}