import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db'; // DB共通モジュール

// お問い合わせデータの型定義
type Inquiry = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

// お問い合わせ一覧を取得
export async function GET() {
  try {
    const inquiries = await executeQuery<Inquiry>(
      'SELECT * FROM inquiries ORDER BY created_at DESC;'
    );

    return NextResponse.json(inquiries);
  } catch (err) {
    console.error('お問い合わせ取得エラー：', err);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました。' },
      { status: 500 }
    );
  }
}

// お問い合わせを登録
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name')?.toString().trim() || '';
    const email = formData.get('email')?.toString().trim() || '';
    const message = formData.get('message')?.toString().trim() || '';

    // 未入力チェック
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: '必須項目が入力されていません。' },
        { status: 400 }
      );
    }

    // DBに登録
    await executeQuery(
      'INSERT INTO inquiries (name, email, message) VALUES (?, ?, ?);',
      [name, email, message]
    );

    return NextResponse.json(
      { message: 'お問い合わせを受け付けました。' },
      { status: 201 }
    );
  } catch (err) {
    console.error('お問い合わせ登録エラー：', err);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました。' },
      { status: 500 }
    );
  }
}
