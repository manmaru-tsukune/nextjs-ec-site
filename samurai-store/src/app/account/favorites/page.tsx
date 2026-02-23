import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { AUTH_TOKEN } from '@/lib/auth';
import FavoriteItemCard from './FavoriteItemCard';

// お気に入り商品の型
interface FavoriteProduct {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  name: string;
  price: number;
  image_url: string | null;
}

// お気に入り一覧を取得
async function getFavorites(): Promise<FavoriteProduct[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN)?.value;
    const headers: HeadersInit = token ? { 'Cookie': `${AUTH_TOKEN}=${token}` } : {};

    const res = await fetch(`${process.env.BASE_URL}/api/favorites`, {
      cache: 'no-store',
      headers,
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('お気に入り一覧取得エラー：', err);
    return [];
  }
}

export default async function FavoritesPage() {
  const favorites = await getFavorites();

  return (
    <main className="container mx-auto px-4 py-8">
      <Link href="/account" className="text-indigo-600 hover:underline">
        ← マイページへ戻る
      </Link>
      <h1 className="text-center mt-4 mb-8">お気に入り一覧</h1>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-500">お気に入りに追加された商品がありません。</p>
      ) : (
        <div className="flex flex-col space-y-4">
          {favorites.map((fav) => (
            <FavoriteItemCard key={fav.id} favorite={fav} />
          ))}
        </div>
      )}
    </main>
  );
}