import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: 'ログインが必要です。' }, { status: 401 });
    }

    const favorites = await executeQuery(
      `SELECT f.id, f.user_id, f.product_id, f.created_at,
              p.name, p.price, p.image_url
       FROM favorites AS f
       JOIN products AS p ON f.product_id = p.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC;`,
      [user.userId]
    );

    return NextResponse.json(favorites);
  } catch (err) {
    console.error('お気に入り取得エラー：', err);
    return NextResponse.json({ message: 'サーバーエラーが発生しました。' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: 'ログインが必要です。' }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ message: '商品IDが必要です。' }, { status: 400 });
    }

    await executeQuery(
      `INSERT IGNORE INTO favorites (user_id, product_id) VALUES (?, ?);`,
      [user.userId, productId]
    );

    return NextResponse.json({ message: 'お気に入りに追加しました。' }, { status: 201 });
  } catch (err) {
    console.error('お気に入り登録エラー：', err);
    return NextResponse.json({ message: 'サーバーエラーが発生しました。' }, { status: 500 });
  }
}