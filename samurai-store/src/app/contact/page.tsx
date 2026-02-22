'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ContactPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.message || 'お問い合わせの送信に失敗しました。');
        return;
      }

      // 送信成功時はトップページへ遷移（完了メッセージ表示用クエリパラメータ付き）
      router.push('/?submitted=1');
    } catch {
      setErrorMessage('通信エラーが発生しました。しばらく経ってから再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <Link href="/" className="text-blue-600 hover:underline text-sm">
        ← トップページへ戻る
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-6">お問い合わせ</h1>

      {errorMessage && (
        <p className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded p-3 text-sm">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 氏名 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            氏名 <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="山田 太郎"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* メールアドレス */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="example@email.com"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* お問い合わせ内容 */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            お問い合わせ内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            placeholder="お問い合わせ内容をご記入ください。"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
          />
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 rounded transition-colors"
        >
          {isSubmitting ? '送信中...' : '送信する'}
        </button>
      </form>
    </main>
  );
}
