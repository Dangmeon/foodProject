import { Food } from '../data/mockFoods';
import FoodCard from './FoodCard';

type SortOption = 'default' | 'calories-asc' | 'protein-desc' | 'sugar-asc';

interface FoodGridProps {
  foods: Food[];
  wishlist: Set<number>;
  cartFoodIds: Set<number>;
  onToggleWishlist: (id: number) => void;
  onAddToCart: (food: Food) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'default', label: '기본 순' },
  { value: 'calories-asc', label: '칼로리 낮은 순' },
  { value: 'protein-desc', label: '단백질 높은 순' },
  { value: 'sugar-asc', label: '당류 낮은 순' },
];

export default function FoodGrid({
  foods,
  wishlist,
  cartFoodIds,
  onToggleWishlist,
  onAddToCart,
  sortBy,
  onSortChange,
}: FoodGridProps) {
  return (
    <section aria-label="식품 목록" className="flex-1 min-w-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5 gap-3">
        <p className="text-sm text-[#566B5D]">
          검색 결과 <span className="font-semibold text-[#17221B]">{foods.length}개</span>
        </p>
        <div className="flex items-center gap-2">
          {/* Sort */}
          <label htmlFor="sort-select" className="sr-only">정렬 기준</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="text-sm border border-[#D8E8DC] bg-white rounded-full pl-3 pr-8 py-1.5 text-[#17221B] focus:outline-none focus:border-[#2A7A4B] focus:ring-2 focus:ring-[#2A7A4B]/20 cursor-pointer appearance-none shadow-sm"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23566B5D' stroke-width='1.5' d='M4 6l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              backgroundSize: '14px',
            }}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {foods.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#566B5D]" role="status" aria-live="polite">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF4EE] flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-[#2A7A4B] opacity-60" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <p className="font-semibold text-[#17221B] text-base">검색 결과가 없습니다</p>
          <p className="text-sm mt-1.5">다른 검색어나 필터 조건을 사용해 보세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label={`식품 ${foods.length}개`}>
          {foods.map((food) => (
            <div key={food.id} role="listitem" className="h-full">
              <FoodCard
                food={food}
                isWishlisted={wishlist?.has(food.id) ?? false}
                isInCart={cartFoodIds?.has(food.id) ?? false}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
