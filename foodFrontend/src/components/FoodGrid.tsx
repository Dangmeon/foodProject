import { Food } from '../data/mockFoods';
import FoodCard from './FoodCard';

type SortOption = 'default' | 'calories-asc' | 'protein-desc' | 'sugar-asc';

interface FoodGridProps {
  foods: Food[];
  wishlist: Set<number>;
  cartFoodIds: Set<number>;
  compareIds: Set<number>;
  onToggleWishlist: (id: number) => void;
  onAddToCart: (food: Food) => void;
  onToggleCompare: (id: number) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onFoodClick: (id: number) => void;
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
                                   compareIds,
                                   onToggleWishlist,
                                   onAddToCart,
                                   onToggleCompare,
                                   sortBy,
                                   onSortChange,
                                   onFoodClick,
                                 }: FoodGridProps) {
  return (
      <section aria-label="식품 목록" className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-800">{foods.length}개</span> 검색됨
            </p>
            {compareIds.size > 0 && (
                <span className="text-[11px] font-semibold px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full">
              {compareIds.size}개 비교 선택 중
            </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="sr-only">정렬 기준</label>
            <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="text-sm border border-slate-200 bg-white rounded-full pl-3 pr-8 py-1.5 text-slate-700 focus:outline-none focus:border-[#2A7A4B] focus:ring-2 focus:ring-[#2A7A4B]/20 cursor-pointer appearance-none shadow-sm"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%2364748B' stroke-width='1.5' d='M4 6l4 4 4-4'/%3E%3C/svg%3E")`,
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
            <div className="flex flex-col items-center justify-center py-24 text-slate-400" role="status" aria-live="polite">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 opacity-50" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <p className="font-semibold text-slate-600 text-base">검색 결과가 없습니다</p>
              <p className="text-sm mt-1.5">다른 검색어나 필터 조건을 사용해 보세요</p>
            </div>
        ) : (
            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                role="list"
                aria-label={`식품 ${foods.length}개`}
            >
              {foods.map((food) => (
                  <div key={food.id} role="listitem">
                    <FoodCard
                        food={food}
                        isWishlisted={wishlist?.has(food.id) ?? false}
                        isInCart={cartFoodIds?.has(food.id) ?? false}
                        isCompare={compareIds.has(food.id)}
                        compareDisabled={compareIds.size >= 3 && !compareIds.has(food.id)}
                        onToggleWishlist={onToggleWishlist}
                        onAddToCart={onAddToCart}
                        onToggleCompare={onToggleCompare}
                        onFoodClick={onFoodClick}
                    />
                  </div>
              ))}
            </div>
        )}
      </section>
  );
}
