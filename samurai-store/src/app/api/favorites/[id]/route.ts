import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: 'ログインが必要です。' }, { status: 401 });
    }

    const { id: productId } = await params;

    const result = await executeQuery<{ id: number }>(
      `SELECT id FROM favorites WHERE user_id = ? AND product_id = ? LIMIT 1;`,
      [user.userId, productId]
    );

    return NextResponse.json(result.length > 0);
  } catch (err) {
    console.error('お気に入り確認エラー：', err);
    return NextResponse.json({ message: 'サーバーエラーが発生しました。' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: 'ログインが必要です。' }, { status: 401 });
    }

    const { id: productId } = await params;

    await executeQuery(
      `DELETE FROM favorites WHERE user_id = ? AND product_id = ?;`,
      [user.userId, productId]
    );

    return NextResponse.json({ message: 'お気に入りを解除しました。' });
  } catch (err) {
    console.error('お気に入り削除エラー：', err);
    return NextResponse.json({ message: 'サーバーエラーが発生しました。' }, { status: 500 });
  }
}