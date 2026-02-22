import Link from 'next/link';

type Inquiry = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

// お問い合わせ一覧をサーバーサイドで取得
async function getInquiries(): Promise<Inquiry[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/inquiries`, {
    cache: 'no-store', // 常に最新データを取得
  });

  if (!res.ok) {
    throw new Error('お問い合わせの取得に失敗しました。');
  }

  return res.json();
}

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <Link href="/admin/products" className="text-blue-600 hover:underline text-sm">
        ← 商品一覧ページへ戻る
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-6">お問い合わせ一覧</h1>

      {inquiries.length === 0 ? (
        <p className="text-gray-500">お問い合わせはまだありません。</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">ID</th>
                <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">氏名</th>
                <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">メールアドレス</th>
                <th className="border border-gray-300 px-4 py-2">お問い合わせ内容</th>
                <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">送信日時</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {inquiry.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {inquiry.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {inquiry.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 max-w-xs">
                    <p className="whitespace-pre-wrap break-words">{inquiry.message}</p>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {new Date(inquiry.created_at).toLocaleString('ja-JP')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
