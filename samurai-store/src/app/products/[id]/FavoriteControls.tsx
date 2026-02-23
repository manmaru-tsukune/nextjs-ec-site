'use client';

import { useState } from 'react';

interface FavoriteControlsProps {
  productId: number;
  initialIsFavorited: boolean;
}

export default function FavoriteControls({ productId, initialIsFavorited }: FavoriteControlsProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (isFavorited) {
        await fetch(`/api/favorites/${productId}`, { method: 'DELETE' });
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
      }
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error('お気に入り操作エラー：', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="text-teal-800 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ fontFamily: 'sans-serif' }}
    >
      {isFavorited ? '♥ お気に入り解除' : '♡ お気に入り追加'}
    </button>
  );
}