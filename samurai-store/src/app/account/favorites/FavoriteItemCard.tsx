'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FavoriteProduct {
  id: number;
  product_id: number;
  name: string;
  price: number;
  image_url: string | null;
}

interface Props {
  favorite: FavoriteProduct;
}

export default function FavoriteItemCard({ favorite }: Props) {
  const [isAdded, setIsAdded] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  // カートに追加
  const handleAddToCart = async () => {
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: favorite.product_id, quantity: 1 }),
      });
      setIsAdded(true);
    } catch (err) {
      console.error('カート追加エラー：', err);
    }
  };

  // お気に入り解除
  const handleRemoveFavorite = async () => {
    const confirmed = window.confirm('本当にお気に入りから削除しますか？');
    if (!confirmed) return;

    try {
      await fetch(`/api/favorites/${favorite.product_id}`, { method: 'DELETE' });
      setIsRemoved(true);
      window.location.href = '/account/favorites';
    } catch (err) {
      console.error('お気に入り解除エラー：', err);
    }
  };

  // 解除済みは非表示
  if (isRemoved) return null;

  const imageUrl = favorite.image_url
    ? `/uploads/${favorite.image_url}`
    : '/images/no-image.jpg';

  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* 左側：画像 + 商品情報 */}
      <div className="flex items-center gap-4">
        <Link href={`/products/${favorite.product_id}`}>
          <Image
            src={imageUrl}
            alt={favorite.name}
            width={120}
            height={120}
            className="object-contain rounded"
          />
        </Link>
        <div>
          <p className="font-bold text-lg">{favorite.name}</p>
          <p className="text-indigo-600 mt-2">
            ¥{favorite.price.toLocaleString()}<span className="text-gray-500 text-sm">（税込）</span>
          </p>
        </div>
      </div>

      {/* 右側：ボタン */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`py-2 px-6 rounded text-white ${
            isAdded ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
          }`}
        >
          {isAdded ? '追加済み' : 'カートに追加'}
        </button>
        <button
          onClick={handleRemoveFavorite}
          className="py-2 px-6 rounded text-white bg-red-600 hover:bg-red-700"
        >
          お気に入り解除
        </button>
      </div>
    </div>
  );
}