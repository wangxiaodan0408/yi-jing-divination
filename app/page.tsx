'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserId, useIsAdmin } from '@/hooks/useUserId';
import { trigrams, hexagramNames } from '@/lib/iching-data';

const ADMIN_SECRET = 'secret123';

const simpleStatements: Record<string, string> = {
  '乾为天': '乾：元亨利贞。',
  '坤为地': '坤：元亨，利牝马之贞。'
};

export default function Home() {
  const { userId, isLoading: userIdLoading } = useUserId();
  const isAdmin = useIsAdmin();
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [question, setQuestion] = useState('');
  const [asker, setAsker] = useState('');
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [num3, setNum3] = useState('');

  const loadRecords = useCallback(async () => {
    if (!userId || userIdLoading) return;

    setIsLoading(true);
    try {
      const url = new URL('/api/divination', window.location.origin);
      url.searchParams.set('userId', userId);
      if (isAdmin) {
        url.searchParams.set('admin', ADMIN_SECRET);
      }

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setRecords(data.records || []);
      }
    } catch (error) {
      console.error('Failed to load records:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userIdLoading, isAdmin]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsSubmitting(true);
    try {
      const n1 = parseInt(num1);
      const n2 = parseInt(num2);
      const n3 = parseInt(num3);

      const A = n1 % 8 || 8;
      const B = n2 % 8 || 8;
      const C = n3 % 6 || 6;

      const hexagramKey = `${B}${A}`;
      const hexagramName = hexagramNames[hexagramKey] || '未知卦';
      const statement = simpleStatements[hexagramName] || '';
      const lineStatement = `第${C}爻变`;

      const originalNumbers = `${num1} ${num2} ${num3}`;
      const correspondingNumbers = `A:${A} B:${B} C:${C}`;

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      const response = await fetch('/api/divination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          date: dateStr,
          question,
          originalNumbers,
          correspondingNumbers,
          hexagram: hexagramName,
          lineChange: `第${C}爻变`,
          askerColumn: asker || '匿名',
          statement,
          lineStatement
        }),
      });

      if (response.ok) {
        await loadRecords();
        setQuestion('');
        setAsker('');
        setNum1('');
        setNum2('');
        setNum3('');
      }
    } catch (error) {
      console.error('Failed:', error);
      alert('占卜失败，请重试！');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">易经数字卦</h1>
              <p className="text-gray-500 text-xs mt-0.5">至诚无息，看见未来</p>
            </div>
            <span className={`text-sm ${isAdmin ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
              {isAdmin ? '👑 管理员模式 - 可见全部数据' : '普通用户模式 - 仅见本地数据'}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm p-5 mb-5 border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">请输入占问信息</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-base font-medium text-gray-900 mb-1.5">占问问题</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="请输入您的问题"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-base font-medium text-gray-900 mb-1.5">第 1 组 3 位数</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  placeholder="请输入3位数"
                  min="100"
                  max="999"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-900 mb-1.5">第 2 组 3 位数</label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  placeholder="请输入3位数"
                  min="100"
                  max="999"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-900 mb-1.5">第 3 组 3 位数</label>
                <input
                  type="number"
                  value={num3}
                  onChange={(e) => setNum3(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  placeholder="请输入3位数"
                  min="100"
                  max="999"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <label className="block text-base font-medium text-gray-900 mb-1.5">占问人</label>
                <input
                  type="text"
                  value={asker}
                  onChange={(e) => setAsker(e.target.value)}
                  className="w-full md:w-48 px-4 py-2.5 border rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  placeholder="请输入占问人姓名"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 md:mt-0 px-8 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {isSubmitting ? '占卜中...' : '开始占卜'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">占卜结果</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-900 border-b">日期</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-900 border-b">问题</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-900 border-b text-center">数字</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-900 border-b">卦名</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-900 border-b text-center">爻变</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-900 border-b">占问人</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">加载中...</td></tr>
                ) : records.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">暂无占卜结果</td></tr>
                ) : (
                  records.map((record, index) => (
                    <tr key={record.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b hover:bg-gray-100`}>
                      <td className="px-3 py-2 text-xs text-gray-900">{record.date}</td>
                      <td className="px-3 py-2 text-xs text-gray-900">{record.question}</td>
                      <td className="px-3 py-2 text-xs text-gray-900 text-center font-mono">{record.original_numbers}</td>
                      <td className="px-3 py-2 text-xs text-gray-900 font-medium">{record.hexagram}</td>
                      <td className="px-3 py-2 text-xs text-gray-900 text-center">{record.line_change}</td>
                      <td className="px-3 py-2 text-xs text-gray-900">{record.asker_column}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
