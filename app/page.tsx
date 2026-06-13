'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [width, setWidth] = useState('1920');
  const [height, setHeight] = useState('1080');
  const [fullPage, setFullPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const res = await fetch('/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          width: parseInt(width),
          height: parseInt(height),
          fullPage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'ไม่สามารถจับภาพได้');
        setLoading(false);
        return;
      }

      setImageUrl(data.imageUrl);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `screenshot-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Web Screenshot</h1>
          <p className="text-slate-300">จับภาพหน้าจอเว็บไซต์ได้ง่ายๆ</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">URL เว็บไซต์</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">ความกว้าง</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">ความสูง</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="fullPage"
                checked={fullPage}
                onChange={(e) => setFullPage(e.target.checked)}
                className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="fullPage" className="text-white text-sm font-medium">จับภาพทั้งหน้าเว็บ</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>กำลังจับภาพ...</span>
                </div>
              ) : (
                'จับภาพหน้าจอ'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
              {error}
            </div>
          )}

          {imageUrl && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">ผลลัพธ์</h2>
                <button
                  onClick={downloadImage}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition text-sm font-medium"
                >
                  ดาวน์โหลด
                </button>
              </div>
              <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={imageUrl}
                  alt="Screenshot"
                  className="w-full"
                  onError={() => setError('ไม่สามารถโหลดภาพได้')}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}