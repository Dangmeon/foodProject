import { useState } from 'react';
import { Food } from '../data/mockFoods';

interface FoodCardProps {
  food: Food;
  isWishlisted: boolean;
  isInCart: boolean;
  isCompare: boolean;
  compareDisabled: boolean;
  onToggleWishlist: (id: number) => void;
  onAddToCart: (food: Food) => void;
  onToggleCompare: (id: number) => void;
  onFoodClick?: (id: number) => void;
}

const NUTRITION = [
  { key: 'calories' as const, label: '칼로리', unit: 'kcal', color: 'text-orange-500', bg: 'bg-orange-50' },
  { key: 'protein' as const, label: '단백질', unit: 'g', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { key: 'sugar' as const, label: '당류', unit: 'g', color: 'text-sky-500', bg: 'bg-sky-50' },
  { key: 'fat' as const, label: '지방', unit: 'g', color: 'text-violet-500', bg: 'bg-violet-50' },
];

export default function FoodCard({
                                   food,
                                   isWishlisted,
                                   isInCart,
                                   isCompare,
                                   compareDisabled,
                                   onToggleWishlist,
                                   onAddToCart,
                                   onToggleCompare,
                                   onFoodClick,
                                 }: FoodCardProps) {
  const [imgError, setImgError] = useState(false);
  const [wishlistPop, setWishlistPop] = useState(false);
  const [cartPop, setCartPop] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(food.id);
    setWishlistPop(true);
    setTimeout(() => setWishlistPop(false), 300);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(food);
    setCartPop(true);
    setTimeout(() => setCartPop(false), 400);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!compareDisabled) onToggleCompare(food.id);
  };

  return (
      <article
          className="bg-white rounded-xl border-2 overflow-hidden transition-all duration-200 h-full flex flex-col cursor-pointer hover:shadow-md"
          style={{
            borderColor: isCompare ? '#4F46E5' : '#E2E8F0',
            boxShadow: isCompare ? '0 0 0 3px rgba(79,70,229,0.12)' : undefined,
          }}
          onClick={() => onFoodClick?.(food.id)}
          aria-label={`${food.name} — ${food.brand}`}
      >
        {/* Top bar: compare + category + wishlist */}
        <div className="flex items-center justify-between px-3.5 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <button
                onClick={handleCompare}
                disabled={compareDisabled}
                className={[
                  'flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold border transition-all duration-150',
                  isCompare
                      ? 'bg-indigo-500 border-indigo-500 text-white shadow-sm'
                      : compareDisabled
                          ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                          : 'border-dashed border-slate-300 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50',
                ].join(' ')}
                aria-label={isCompare ? '비교 선택 해제' : '비교 대상으로 추가'}
                aria-pressed={isCompare}
            >
              {isCompare ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                    선택됨
                  </>
              ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                    비교
                  </>
              )}
            </button>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
            {food.category}
          </span>
          </div>

          <button
              onClick={handleWishlist}
              className={`w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${wishlistPop ? 'scale-125' : ''} ${isWishlisted ? 'text-[#F5762E]' : 'text-slate-300 hover:text-[#F5762E]'}`}
              aria-label={isWishlisted ? `${food.name} 찜 해제` : `${food.name} 찜하기`}
              aria-pressed={isWishlisted}
          >
            <svg viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Product info: thumbnail + name */}
        <div className="flex items-start gap-3 px-3.5 pb-3">
          <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
            {!imgError ? (
                <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={() => setImgError(true)}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-slate-300" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
            )}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[11px] text-slate-400 font-medium mb-0.5 truncate">{food.brand}</p>
            <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
              {food.name}
            </h3>
          </div>
        </div>

        {/* Nutrition grid — hero section */}
        <div className="mx-3.5 mb-3 grid grid-cols-4 gap-px bg-slate-100 rounded-xl overflow-hidden" role="list" aria-label="영양 성분">
          {NUTRITION.map((n) => (
              <div key={n.key} className={`${n.bg} py-2.5 flex flex-col items-center gap-0.5`} role="listitem">
            <span className={`text-sm font-bold leading-none tabular-nums ${n.color}`}>
              {food[n.key]}
            </span>
                <span className="text-[9px] text-slate-400 leading-none">{n.unit}</span>
                <span className="text-[10px] text-slate-500 font-medium mt-0.5">{n.label}</span>
              </div>
          ))}
        </div>

        {/* Price + cart */}
        <div className="px-3.5 pb-3.5 mt-auto flex items-center justify-between">
          <div>
          <span className="font-bold text-slate-900 text-sm tabular-nums">
            ₩{food.price.toLocaleString()}
          </span>
            <span className="text-[10px] text-slate-400 ml-1">{food.servingSize}</span>
          </div>
          <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${cartPop ? 'scale-105' : ''} ${
                  isInCart
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-[#2A7A4B] text-white hover:bg-[#3D9960] shadow-sm'
              }`}
              aria-label={isInCart ? '장바구니에 있음' : `${food.name} 장바구니 담기`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5" aria-hidden="true">
              {isInCart ? (
                  <path d="M20 6 9 17l-5-5" />
              ) : (
                  <>
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </>
              )}
            </svg>
            {isInCart ? '담겼음' : '담기'}
          </button>
        </div>
      </article>
  );
}
