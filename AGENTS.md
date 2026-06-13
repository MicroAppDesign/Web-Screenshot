# Web Screenshot API - คู่มือการใช้งาน

## 📌 ข้อสำคัญเกี่ยวกับสภาพแวดล้อม

API จะทำงานต่างกันระหว่าง Local และ Vercel:

### Local Development
- ใช้ **Puppeteer** จับภาพหน้าจอโดยตรง
- ความเร็วสูงและมีประสิทธิภาพดี
- ติดตั้ง Chromium ขึ้นมาใช้งานเอง

### Vercel Production
- ใช้ **บริการฟรี** (ScreenshotMachine)
- เพื่อป้องกันปัญหา Timeout และข้อจำกัดของ Vercel
- ทำงานได้รวดเร็วและเชื่อถือได้

---

## API Endpoint

### Local Development
```
POST http://localhost:3001/api/screenshot
```

### Vercel Production
```
POST https://web-screenshot-six.vercel.app/api/screenshot
```

## Request Body (JSON)

```json
{
  "url": "https://example.com",
  "width": 1920,
  "height": 1080,
  "fullPage": false
}
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| url | string | ✅ Yes | - | URL ของเว็บไซต์ที่ต้องการจับภาพ (จำเป็นต้องมี http:// หรือ https://) |
| width | number | ❌ No | 1920 | ความกว้างของภาพ |
| height | number | ❌ No | 1080 | ความสูงของภาพ |
| fullPage | boolean | ❌ No | false | จับภาพทั้งหน้าเว็บหรือไม่ |

## Response

### Success Response (200 OK)
```json
{
  "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

### Error Response (400/500)
```json
{
  "error": "Failed to capture screenshot"
}
```

---

## ตัวอย่างการใช้งาน

### 1. ใช้งานด้วย cURL

**Local:**
```bash
curl -X POST http://localhost:3001/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://google.com",
    "width": 1920,
    "height": 1080,
    "fullPage": false
  }'
```

**Vercel:**
```bash
curl -X POST https://web-screenshot-six.vercel.app/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://google.com",
    "width": 1920,
    "height": 1080,
    "fullPage": false
  }'
```

### 2. ใช้งานด้วย JavaScript (Fetch)

**Local:**
```javascript
const response = await fetch('http://localhost:3001/api/screenshot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://google.com',
    width: 1920,
    height: 1080,
    fullPage: false
  })
});

const data = await response.json();
console.log('Image URL:', data.imageUrl);
```

**Vercel:**
```javascript
const response = await fetch('https://web-screenshot-six.vercel.app/api/screenshot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://google.com',
    width: 1920,
    height: 1080,
    fullPage: false
  })
});

const data = await response.json();
console.log('Image URL:', data.imageUrl);
```

### 3. ใช้งานด้วย Node.js

**Local:**
```javascript
const fetch = require('node-fetch');

async function takeScreenshot() {
  const response = await fetch('http://localhost:3001/api/screenshot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://google.com',
      width: 1280,
      height: 720,
      fullPage: false
    })
  });

  const data = await response.json();
  
  // แสดงภาพใน browser หรือใช้ data:image URL ต่อได้เลย
  console.log('Screenshot ready:', data.imageUrl);
}

takeScreenshot();
```

**Vercel:**
```javascript
const fetch = require('node-fetch');

async function takeScreenshot() {
  const response = await fetch('https://web-screenshot-six.vercel.app/api/screenshot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://google.com',
      width: 1280,
      height: 720,
      fullPage: false
    })
  });

  const data = await response.json();
  
  // แสดงภาพใน browser หรือใช้ data:image URL ต่อได้เลย
  console.log('Screenshot ready:', data.imageUrl);
}

takeScreenshot();
```

### 4. ใช้งานด้วย Local Script (fetch-screenshot.cjs)

เราได้เตรียม script ไว้ให้แล้วที่ `fetch-screenshot.cjs` สามารถใช้งานได้ง่ายๆ:

```bash
# ตัวอย่างพื้นฐาน
npm run screenshot https://google.com

# ตัวอย่างกำหนดค่า
npm run screenshot https://google.com 1280 720 true my-screenshot.png

# หรือใช้ node โดยตรง
node fetch-screenshot.cjs https://example.com
```

### 5. ใช้งานใน React Component

```tsx
import { useState } from 'react';

export default function ScreenshotComponent() {
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // ใช้ Local API
      const response = await fetch('http://localhost:3001/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      // หรือใช้ Vercel API
      // const response = await fetch('https://web-screenshot-six.vercel.app/api/screenshot', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ url })
      // });
      
      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="https://example.com"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Take Screenshot'}
        </button>
      </form>
      
      {imageUrl && <img src={imageUrl} alt="Screenshot" />}
    </div>
  );
}
```

---

## คำแนะนำ

### สำหรับ Local Development
- ต้องรัน `npm run dev` ก่อนใช้งาน
- ใช้ `http://localhost:3001` เป็น base URL
- ความเร็วขึ้นกว่า Vercel เพราะรันบนเครื่องของคุณเอง

### สำหรับ Vercel Production
- URL คือ `https://web-screenshot-six.vercel.app`
- สามารถใช้งานจากทุกที่ได้
- สะดวกสบายแต่อาจช้ากว่าเล็กน้อย

### Error Handling
```javascript
try {
  const response = await fetch(API_URL, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }
  
  const data = await response.json();
  return data.imageUrl;
} catch (error) {
  console.error('Screenshot failed:', error);
  throw error;
}
```

### การใช้ภาพที่ได้รับ
ภาพที่ได้มาเป็น `data:image/png;base64,...` format คุณสามารถ:
1. แสดงใน `<img src={imageUrl}>` ได้เลย
2. ดาวน์โหลดเป็นไฟล์
3. เก็บไว้ใน database
4. แปลงเป็นไฟล์รูปภาพได้

---

## สรุป URLs

| Environment | Base URL |
|-------------|----------|
| Local | http://localhost:3001 |
| Vercel | https://web-screenshot-six.vercel.app |
