'use client';

import { useState } from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">易经数字卦</h1>
              <p className="text-gray-500 text-xs mt-0.5">至诚无息，看见未来</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🎉 成功运行！</h2>
        <p className="text-gray-600 mb-8">页面已经可以正常访问了！</p>
      </div>
    </div>
  );
}