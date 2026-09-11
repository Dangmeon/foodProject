import { useState } from 'react';
import { Food } from '../data/mockFoods';

interface FoodCardProps {
  food: Food;
  isWishlisted: boolean;
  isInCart: boolean;
  onToggleWishlist: (id: number) => void;
  onAddToCart: (food: Food) => void;
}

const categoryStyles: Record<string, { bg: string; badge: string }> = {
  건강식품: { bg: 'bg-green-50', badge: 'bg-green-100 text-green-700' },
  유제품: { bg: 'bg-sky-50', badge: 'bg-sky-100 text-sky-700' },
  가공식품: { bg: 'bg-orange-50', badge: 'bg-orange-100 text-orange-700' },
  음료: { bg: 'bg-violet-50', badge: 'bg-violet-100 text-violet-700' },
  스낵: { bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-700' },
  곡류: { bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700' },
};

export default function FoodCard({ food, isWishlisted, isInCart, onToggleWishlist, onAddToCart }: FoodCardProps) {
  const [imgError, setImgError] = useState(false);
  const [wishlistPop, setWishlistPop] = useState(false);
  const [cartPop, setCartPop] = useState(false);

  const isHighProtein = food.protein >= 15;
  const isLowCalorie = food.calories <= 100;
  const isLowSugar = food.sugar <= 3;

  const styles = categoryStyles[food.category] ?? { bg: 'bg-gray-50', badge: 'bg-gray-100 text-gray-700' };

  const handleWishlist = () => {
    onToggleWishlist(food.id);
    setWishlistPop(true);
    setTimeout(() => setWishlistPop(false), 300);
  };

  const handleAddToCart = () => {
    onAddToCart(food);
    setCartPop(true);
    setTimeout(() => setCartPop(false), 400);
  };

  return (
    <article
      className="group bg-white rounded-xl border border-[#D8E8DC] overflow-hidden shadow-sm transition-all duration-300 ease-out hover:shadow-lg hover:shadow-[#2A7A4B]/10 hover:-translate-y-1 hover:border-[#2A7A4B]/30 h-full flex flex-col"
      aria-label={`${food.name} — ${food.brand}`}
    >
      {/* Square image */}
      <div className={`relative aspect-square ${styles.bg} overflow-hidden shrink-0`}>
        {!imgError ? (
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 opacity-20 text-[#566B5D]" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${styles.badge}`}>
            {food.category}
          </span>
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md transition-all duration-200 hover:scale-110 ${wishlistPop ? 'scale-125' : ''} ${isWishlisted ? 'text-[#F5762E]' : 'text-[#9DB3A3] hover:text-[#F5762E]'}`}
          aria-label={isWishlisted ? `${food.name} 찜 해제` : `${food.name} 찜하기`}
          aria-pressed={isWishlisted}
        >
          <svg viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Special nutrition overlays */}
        {(isHighProtein || isLowCalorie || isLowSugar) && (
          <div className="absolute bottom-2.5 left-2.5 flex gap-1 flex-wrap">
            {isHighProtein && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#2A7A4B] text-white shadow-sm">고단백</span>
            )}
            {isLowCalorie && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/90 text-[#2A7A4B] border border-[#2A7A4B]/20 shadow-sm">저칼로리</span>
            )}
            {isLowSugar && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/90 text-[#2A7A4B] border border-[#2A7A4B]/20 shadow-sm">저당</span>
            )}
          </div>
        )}
      </div>

      {/* Card body — flex col, fills remaining height */}
      <div className="p-3.5 flex flex-col flex-1">
        <p className="text-[11px] text-[#566B5D] font-medium mb-0.5">{food.brand}</p>
        <h3 className="font-semibold text-[#17221B] text-sm leading-snug line-clamp-2">
          {food.name}
        </h3>

        {/* Bottom block — mt-auto pins nutrition + price to card bottom */}
        <div className="mt-auto pt-3">
          {/* Compact nutrition badges */}
          <div className="flex flex-wrap gap-1 mb-2.5" role="list" aria-label="영양 성분">
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FEF0E7] text-[#F5762E]"
              role="listitem"
              aria-label={`칼로리 ${food.calories}kcal`}
            >
              {food.calories}kcal
            </span>
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF4EE] text-[#2A7A4B]"
              role="listitem"
              aria-label={`단백질 ${food.protein}g`}
            >
              단백질 {food.protein}g
            </span>
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-600"
              role="listitem"
              aria-label={`당류 ${food.sugar}g`}
            >
              당류 {food.sugar}g
            </span>
          </div>

          {/* Price + Cart button */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-[#17221B] text-sm">
              {food.price.toLocaleString()}
              <span className="text-xs font-normal text-[#566B5D] ml-0.5">원</span>
            </span>
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${cartPop ? 'scale-105' : ''} ${
                isInCart
                  ? 'bg-[#EAF4EE] text-[#2A7A4B] border border-[#2A7A4B]/20'
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
        </div>
      </div>
    </article>
  );
}
