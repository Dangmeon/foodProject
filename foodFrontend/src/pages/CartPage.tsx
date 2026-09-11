import { useState } from 'react';
import { Food, mockFoods } from '../data/mockFoods';

export interface CartItem {
  food: Food;
  quantity: number;
}

interface CartPageProps {
  cartItems: CartItem[];
  wishlist: Set<number>;
  onUpdateQuantity: (foodId: number, quantity: number) => void;
  onRemoveFromCart: (foodId: number) => void;
  onToggleWishlist: (foodId: number) => void;
  onAddToCart: (food: Food) => void;
  onNavigateToMain: () => void;
}

type Tab = 'cart' | 'wishlist';

// ─── Cart Item Row ────────────────────────────────────────────────────────────
function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (qty: number) => void;
  onRemove: () => void;
}) {
  const { food, quantity } = item;

  return (
    <div className="flex gap-4 py-5 border-b border-[#EEF5F0] last:border-0 group">
      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#EAF4EE] shrink-0">
        <img
          src={food.imageUrl}
          alt={food.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#566B5D] font-medium mb-0.5">{food.brand}</p>
        <h4 className="text-sm font-semibold text-[#17221B] leading-snug mb-2 line-clamp-2">{food.name}</h4>

        {/* Nutrition mini-badges */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#FEF0E7] text-[#F5762E]">
            {food.calories}kcal
          </span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#EAF4EE] text-[#2A7A4B]">
            단백질 {food.protein}g
          </span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-sky-50 text-sky-600">
            당류 {food.sugar}g
          </span>
        </div>

        {/* Bottom row: quantity + price + delete */}
        <div className="flex items-center justify-between gap-3">
          {/* Quantity control */}
          <div className="flex items-center gap-0 rounded-xl border border-[#D8E8DC] overflow-hidden">
            <button
              onClick={() => onUpdateQuantity(quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-[#566B5D] hover:bg-[#EAF4EE] hover:text-[#2A7A4B] transition-colors disabled:opacity-40"
              disabled={quantity <= 1}
              aria-label="수량 감소"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <span className="w-9 text-center text-sm font-semibold text-[#17221B] font-mono" aria-label={`수량 ${quantity}`}>
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-[#566B5D] hover:bg-[#EAF4EE] hover:text-[#2A7A4B] transition-colors"
              aria-label="수량 증가"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {/* Price */}
          <span className="font-semibold text-[#17221B] text-sm">
            {(food.price * quantity).toLocaleString()}
            <span className="text-xs font-normal text-[#566B5D] ml-0.5">원</span>
          </span>

          {/* Delete */}
          <button
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#9DB3A3] hover:text-red-500 hover:bg-red-50 transition-all"
            aria-label={`${food.name} 장바구니에서 삭제`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6 18.1 19a2 2 0 0 1-2 1.9H7.9a2 2 0 0 1-2-1.9L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Order Summary ────────────────────────────────────────────────────────────
function OrderSummary({ cartItems }: { cartItems: CartItem[] }) {
  const subtotal = cartItems.reduce((s, item) => s + item.food.price * item.quantity, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 30000 ? 0 : 3000;
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-white rounded-2xl border border-[#D8E8DC] p-6 sticky top-20" aria-label="주문 요약">
      <h3 className="font-semibold text-[#17221B] text-base mb-5">주문 요약</h3>

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-[#566B5D]">상품 금액</dt>
          <dd className="font-medium text-[#17221B]">{subtotal.toLocaleString()}원</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[#566B5D]">배송비</dt>
          <dd className={`font-medium ${deliveryFee === 0 && subtotal > 0 ? 'text-[#2A7A4B]' : 'text-[#17221B]'}`}>
            {subtotal === 0 ? '-' : deliveryFee === 0 ? '무료' : `${deliveryFee.toLocaleString()}원`}
          </dd>
        </div>
      </dl>

      {subtotal > 0 && subtotal < 30000 && (
        <div className="mt-3 px-3 py-2 rounded-xl bg-[#EAF4EE] text-[#2A7A4B]">
          <p className="text-xs font-medium">
            {(30000 - subtotal).toLocaleString()}원 더 담으면 무료배송!
          </p>
          <div className="mt-1.5 h-1.5 rounded-full bg-[#D8E8DC] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#2A7A4B] transition-all duration-500"
              style={{ width: `${Math.min(100, (subtotal / 30000) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="h-px bg-[#D8E8DC] my-4" />

      <div className="flex justify-between text-base font-bold">
        <span className="text-[#17221B]">최종 결제금액</span>
        <span className="text-[#2A7A4B]">{total.toLocaleString()}원</span>
      </div>

      <button
        disabled={cartItems.length === 0}
        className="w-full mt-5 py-3.5 rounded-xl bg-[#2A7A4B] text-white font-bold text-sm hover:bg-[#3D9960] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        aria-label={`${total.toLocaleString()}원 결제하기`}
      >
        {cartItems.length === 0 ? '장바구니가 비어있습니다' : `${total.toLocaleString()}원 결제하기`}
      </button>

      <p className="text-center text-xs text-[#9DB3A3] mt-3">
        주문 후 취소/환불은 마이페이지에서 가능해요
      </p>
    </div>
  );
}

// ─── Wishlist Item Row ────────────────────────────────────────────────────────
function WishlistItemRow({
  food,
  isInCart,
  onAddToCart,
  onRemoveWishlist,
}: {
  food: Food;
  isInCart: boolean;
  onAddToCart: (food: Food) => void;
  onRemoveWishlist: () => void;
}) {
  return (
    <div className="flex gap-4 py-5 border-b border-[#EEF5F0] last:border-0 group">
      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#EAF4EE] shrink-0">
        <img
          src={food.imageUrl}
          alt={food.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#566B5D] font-medium mb-0.5">{food.brand}</p>
        <h4 className="text-sm font-semibold text-[#17221B] leading-snug mb-2">{food.name}</h4>

        {/* Nutrition mini-badges */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#FEF0E7] text-[#F5762E]">
            {food.calories}kcal
          </span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#EAF4EE] text-[#2A7A4B]">
            단백질 {food.protein}g
          </span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-sky-50 text-sky-600">
            당류 {food.sugar}g
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#17221B] text-sm">
            {food.price.toLocaleString()}
            <span className="text-xs font-normal text-[#566B5D] ml-0.5">원</span>
          </span>
          <div className="flex-1" />

          <button
            onClick={() => onAddToCart(food)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
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
            {isInCart ? '담겼음' : '장바구니 담기'}
          </button>

          <button
            onClick={onRemoveWishlist}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#566B5D] border border-[#D8E8DC] hover:border-[#F5762E] hover:text-[#F5762E] hover:bg-[#FEF0E7] transition-all"
            aria-label={`${food.name} 찜 해제`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" className="w-3.5 h-3.5 text-[#F5762E]" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            찜 해제
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Page ────────────────────────────────────────────────────────────────
export default function CartPage({
  cartItems,
  wishlist,
  onUpdateQuantity,
  onRemoveFromCart,
  onToggleWishlist,
  onAddToCart,
  onNavigateToMain,
}: CartPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('cart');

  const wishlistedFoods = mockFoods.filter((f) => wishlist.has(f.id));
  const cartFoodIds = new Set(cartItems.map((i) => i.food.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16" id="main-content">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onNavigateToMain}
          className="flex items-center gap-1.5 text-sm text-[#566B5D] hover:text-[#2A7A4B] transition-colors"
          aria-label="메인 페이지로 돌아가기"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="m15 18-6-6 6-6" />
          </svg>
          쇼핑 계속하기
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-[#D8E8DC] mb-8" role="tablist" aria-label="페이지 탭">
        <button
          role="tab"
          aria-selected={activeTab === 'cart'}
          onClick={() => setActiveTab('cart')}
          className={`relative flex items-center gap-2 pb-3 px-1 mr-6 text-sm font-semibold transition-colors ${
            activeTab === 'cart' ? 'text-[#17221B]' : 'text-[#9DB3A3] hover:text-[#566B5D]'
          }`}
        >
          장바구니
          <span
            className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold transition-colors ${
              activeTab === 'cart' ? 'bg-[#2A7A4B] text-white' : 'bg-[#EEF5F0] text-[#566B5D]'
            }`}
          >
            {cartItems.length}
          </span>
          {activeTab === 'cart' && (
            <span className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-[#2A7A4B] rounded-full" />
          )}
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'wishlist'}
          onClick={() => setActiveTab('wishlist')}
          className={`relative flex items-center gap-2 pb-3 px-1 text-sm font-semibold transition-colors ${
            activeTab === 'wishlist' ? 'text-[#17221B]' : 'text-[#9DB3A3] hover:text-[#566B5D]'
          }`}
        >
          찜한 상품
          <span
            className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold transition-colors ${
              activeTab === 'wishlist' ? 'bg-[#F5762E] text-white' : 'bg-[#EEF5F0] text-[#566B5D]'
            }`}
          >
            {wishlist.size}
          </span>
          {activeTab === 'wishlist' && (
            <span className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-[#F5762E] rounded-full" />
          )}
        </button>
      </div>

      {/* ── Cart Tab ── */}
      {activeTab === 'cart' && (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left: item list */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-[#D8E8DC] p-6" role="tabpanel" aria-label="장바구니 상품 목록">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-[#566B5D]">
                  <div className="w-16 h-16 rounded-2xl bg-[#EAF4EE] flex items-center justify-center mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-[#2A7A4B] opacity-60" aria-hidden="true">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  </div>
                  <p className="font-semibold text-[#17221B] text-base mb-1">장바구니가 비어있어요</p>
                  <p className="text-sm mb-5">마음에 드는 식품을 담아보세요</p>
                  <button
                    onClick={onNavigateToMain}
                    className="px-5 py-2.5 rounded-xl bg-[#2A7A4B] text-white font-semibold text-sm hover:bg-[#3D9960] transition-colors"
                  >
                    식품 둘러보기
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2 text-sm text-[#566B5D]">
                    <span>총 <strong className="text-[#17221B]">{cartItems.length}개</strong> 상품</span>
                    <span className="text-xs text-[#9DB3A3]">각 항목에 마우스를 올리면 삭제 버튼이 표시됩니다</span>
                  </div>
                  {cartItems.map((item) => (
                    <CartItemRow
                      key={item.food.id}
                      item={item}
                      onUpdateQuantity={(qty) => onUpdateQuantity(item.food.id, qty)}
                      onRemove={() => onRemoveFromCart(item.food.id)}
                    />
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Right: order summary */}
          <div className="w-full lg:w-80 shrink-0">
            <OrderSummary cartItems={cartItems} />
          </div>
        </div>
      )}

      {/* ── Wishlist Tab ── */}
      {activeTab === 'wishlist' && (
        <div role="tabpanel" aria-label="찜한 상품 목록">
          {wishlistedFoods.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#D8E8DC] p-8 flex flex-col items-center justify-center py-16 text-[#566B5D]">
              <div className="w-16 h-16 rounded-2xl bg-[#FEF0E7] flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-[#F5762E] opacity-60" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <p className="font-semibold text-[#17221B] text-base mb-1">찜한 상품이 없어요</p>
              <p className="text-sm mb-5">마음에 드는 식품의 하트를 눌러보세요</p>
              <button
                onClick={onNavigateToMain}
                className="px-5 py-2.5 rounded-xl bg-[#2A7A4B] text-white font-semibold text-sm hover:bg-[#3D9960] transition-colors"
              >
                식품 둘러보기
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#D8E8DC] p-6">
              <p className="text-sm text-[#566B5D] mb-4">
                총 <strong className="text-[#17221B]">{wishlistedFoods.length}개</strong> 상품을 찜했어요
              </p>
              {wishlistedFoods.map((food) => (
                <WishlistItemRow
                  key={food.id}
                  food={food}
                  isInCart={cartFoodIds.has(food.id)}
                  onAddToCart={onAddToCart}
                  onRemoveWishlist={() => onToggleWishlist(food.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
