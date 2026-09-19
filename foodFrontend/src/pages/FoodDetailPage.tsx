import { useState, useEffect } from 'react';
import { Food } from '../data/mockFoods';

type ConsumerType = 'general' | 'dieter' | 'fitness' | 'diabetic' | 'child';

interface RDA { calories: number; protein: number; fat: number; carbs: number; sugar: number; }

const CONSUMER_PROFILES: Record<ConsumerType, { label: string; emoji: string; desc: string; rda: RDA }> = {
    general:  { label: '일반인',  emoji: '🧑', desc: '성인 평균 2,000kcal 기준', rda: { calories: 2000, protein: 55,  fat: 54, carbs: 324, sugar: 100 } },
    dieter:   { label: '다이어터', emoji: '🥗', desc: '칼로리 제한 1,500kcal 기준', rda: { calories: 1500, protein: 65,  fat: 42, carbs: 200, sugar: 30  } },
    fitness:  { label: '헬스인',  emoji: '💪', desc: '고강도 훈련 2,800kcal 기준', rda: { calories: 2800, protein: 140, fat: 78, carbs: 350, sugar: 50  } },
    diabetic: { label: '당 관리', emoji: '🩸', desc: '혈당 관리 1,800kcal 기준',  rda: { calories: 1800, protein: 60,  fat: 50, carbs: 225, sugar: 25  } },
    child:    { label: '어린이',  emoji: '👧', desc: '초등학생 1,700kcal 기준',   rda: { calories: 1700, protein: 35,  fat: 57, carbs: 270, sugar: 60  } },
};

const NUTRIENT_CONFIG = [
    { key: 'calories' as keyof RDA, label: '칼로리', unit: 'kcal', color: '#F5762E', bg: '#FEF0E7', text: 'text-[#F5762E]' },
    { key: 'protein'  as keyof RDA, label: '단백질', unit: 'g',    color: '#2A7A4B', bg: '#EAF4EE', text: 'text-[#2A7A4B]' },
    { key: 'fat'      as keyof RDA, label: '지방',   unit: 'g',    color: '#8B5CF6', bg: '#F5F3FF', text: 'text-violet-600' },
    { key: 'carbs'    as keyof RDA, label: '탄수화물', unit: 'g',  color: '#F59E0B', bg: '#FFFBEB', text: 'text-amber-500'  },
    { key: 'sugar'    as keyof RDA, label: '당류',   unit: 'g',    color: '#0EA5E9', bg: '#F0F9FF', text: 'text-sky-500'   },
];

const REVIEW_POOL = [
    { user: '건강러버김*수', rating: 5, content: '운동 후 먹기에 완벽한 영양 공급원이에요. 맛도 생각보다 훨씬 좋아서 매일 챙겨 먹고 있어요!', helpful: 24, tags: ['재구매 의사 있음', '맛있어요'] },
    { user: '다이어트중박*진', rating: 4, content: '칼로리가 낮아서 다이어트할 때 부담 없이 먹을 수 있어요. 포만감도 오래 가고요.', helpful: 18, tags: ['포만감 좋음', '다이어트 추천'] },
    { user: '헬린이이*현', rating: 5, content: '단백질 함량이 높아서 운동 목표 달성에 큰 도움이 되고 있어요. 가격 대비 만족스럽습니다.', helpful: 31, tags: ['고단백', '가성비 좋음'] },
    { user: '건강식단최*영', rating: 3, content: '영양성분은 훌륭한데 맛이 조금 아쉽네요. 건강을 위해 계속 먹고 있습니다.', helpful: 7, tags: ['영양가 높음'] },
    { user: '요리유튜버정*아', rating: 4, content: '요리에 활용하기도 좋고 그냥 먹어도 맛있어요. 가족들도 모두 좋아하는 제품이에요.', helpful: 15, tags: ['맛있어요', '활용도 높음'] },
    { user: '영양사오*우', rating: 5, content: '영양 성분 밸런스가 훌륭해요. 주변에도 적극 추천하는 제품입니다.', helpful: 42, tags: ['전문가 추천', '영양 밸런스'] },
];

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
    const dim = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5';
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} viewBox="0 0 24 24" className={dim} aria-hidden="true">
                    <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        fill={i <= Math.round(rating) ? '#F5762E' : '#E5E7EB'}
                        stroke={i <= Math.round(rating) ? '#F5762E' : '#E5E7EB'}
                        strokeWidth="1"
                    />
                </svg>
            ))}
        </div>
    );
}

function NutritionBar({ label, unit, value, max, color, bg }: {
    label: string; unit: string; value: number; max: number; color: string; bg: string;
}) {
    const pct = Math.min((value / max) * 100, 100);
    const overflow = (value / max) * 100 > 100;
    const isHigh = pct >= 50;

    return (
        <div className="group">
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#17221B] w-16">{label}</span>
                    <span className="text-xs text-[#566B5D]">{value}{unit}</span>
                    {overflow && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600">초과</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[#9DB3A3]">권장량 {max}{unit}</span>
                    <span
                        className={`text-xs font-bold min-w-[44px] text-right ${overflow ? 'text-rose-500' : isHigh ? 'text-amber-500' : 'text-[#566B5D]'}`}
                    >
            {((value / max) * 100).toFixed(1)}%
          </span>
                </div>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#F4F8F5' }}>
                <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                        width: `${pct}%`,
                        background: overflow ? '#EF4444' : color,
                    }}
                />
            </div>
        </div>
    );
}

interface FoodDetailPageProps {
    food: Food;
    isWishlisted: boolean;
    isInCart: boolean;
    onToggleWishlist: (id: number) => void;
    onAddToCart: (food: Food) => void;
    onBack: () => void;
    allFoods: Food[];
    onFoodClick: (id: number) => void;
}

export default function FoodDetailPage({
                                           food, isWishlisted, isInCart, onToggleWishlist, onAddToCart, onBack, allFoods, onFoodClick,
                                       }: FoodDetailPageProps) {
    const [activeConsumer, setActiveConsumer] = useState<ConsumerType>('general');
    const [imgError, setImgError] = useState(false);
    const [cartPop, setCartPop] = useState(false);
    const [wishPop, setWishPop] = useState(false);

    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [food.id]);

    const profile = CONSUMER_PROFILES[activeConsumer];
    const { rda } = profile;

    const recommendations = allFoods
        .filter((f) => f.category === food.category && f.id !== food.id)
        .slice(0, 4);

    const reviews = [0, 1, 2].map((i) => ({
        ...REVIEW_POOL[(food.id + i) % REVIEW_POOL.length],
        id: i,
        date: `2026.0${Math.max(7, 9 - i)}.${String(10 + ((food.id * 3 + i * 7) % 20)).padStart(2, '0')}`,
    }));
    const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

    const handleAddToCart = () => {
        onAddToCart(food);
        setCartPop(true);
        setTimeout(() => setCartPop(false), 400);
    };
    const handleWishlist = () => {
        onToggleWishlist(food.id);
        setWishPop(true);
        setTimeout(() => setWishPop(false), 300);
    };

    const categoryColors: Record<string, { bg: string; text: string }> = {
        건강식품: { bg: 'bg-green-100', text: 'text-green-700' },
        유제품: { bg: 'bg-sky-100', text: 'text-sky-700' },
        가공식품: { bg: 'bg-orange-100', text: 'text-orange-700' },
        음료: { bg: 'bg-violet-100', text: 'text-violet-700' },
        스낵: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
        곡류: { bg: 'bg-amber-100', text: 'text-amber-700' },
    };
    const catStyle = categoryColors[food.category] ?? { bg: 'bg-gray-100', text: 'text-gray-600' };

    // Find best nutrient coverage for insight text
    const coverages = NUTRIENT_CONFIG.map((n) => ({
        ...n,
        pct: ((food[n.key as keyof Food] as number) / rda[n.key]) * 100,
    }));
    const best = coverages.reduce((a, b) => (a.pct > b.pct ? a : b));

    return (
        <div className="min-h-screen bg-[#F4F8F5] pt-16">
            <div className="max-w-7xl mx-auto px-10">
                {/* Breadcrumb */}
                <div className="pt-8 pb-5">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-sm text-[#566B5D] hover:text-[#2A7A4B] transition-colors group"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true">
                            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        검색 목록으로
                    </button>
                </div>

                {/* ── Product Hero ── */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8" aria-label="상품 정보">
                    {/* Image */}
                    <div className="bg-white rounded-2xl border border-[#D8E8DC] overflow-hidden shadow-sm aspect-square flex items-center justify-center">
                        {!imgError ? (
                            <img
                                src={food.imageUrl}
                                alt={food.name}
                                className="w-full h-full object-cover"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-3 text-[#9DB3A3]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 opacity-30" aria-hidden="true">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                                <span className="text-sm">이미지 없음</span>
                            </div>
                        )}
                    </div>

                    {/* Info panel */}
                    <div className="bg-white rounded-2xl border border-[#D8E8DC] p-8 shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${catStyle.bg} ${catStyle.text}`}>
                {food.category}
              </span>
                            {food.protein >= 15 && (
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF4EE] text-[#2A7A4B]">고단백</span>
                            )}
                            {food.sugar <= 3 && (
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-600">저당</span>
                            )}
                        </div>

                        <p className="text-sm text-[#566B5D] font-medium mb-1">{food.brand}</p>
                        <h1 className="text-2xl font-bold text-[#17221B] leading-snug mb-3">{food.name}</h1>

                        <div className="flex items-center gap-2 mb-4">
                            <Stars rating={avgRating} size="sm" />
                            <span className="text-sm font-semibold text-[#17221B]">{avgRating.toFixed(1)}</span>
                            <span className="text-sm text-[#9DB3A3]">({reviews.length}개 리뷰)</span>
                        </div>

                        <div className="flex gap-5 py-4 border-y border-[#EEF5F0] mb-5">
                            {[
                                { label: '칼로리', value: `${food.calories}kcal`, color: 'text-[#F5762E]', bg: 'bg-[#FEF0E7]' },
                                { label: '단백질', value: `${food.protein}g`, color: 'text-[#2A7A4B]', bg: 'bg-[#EAF4EE]' },
                                { label: '당류',   value: `${food.sugar}g`,   color: 'text-sky-600',   bg: 'bg-sky-50'   },
                                { label: '지방',   value: `${food.fat}g`,     color: 'text-violet-600', bg: 'bg-violet-50' },
                            ].map((n) => (
                                <div key={n.label} className={`flex-1 flex flex-col items-center py-2 rounded-xl ${n.bg}`}>
                                    <span className={`text-base font-bold ${n.color}`}>{n.value}</span>
                                    <span className="text-[10px] text-[#566B5D] font-medium mt-0.5">{n.label}</span>
                                </div>
                            ))}
                        </div>

                        <p className="text-xs text-[#9DB3A3] mb-4">1회 제공량: {food.servingSize}</p>

                        <div className="mt-auto">
                            <p className="text-3xl font-bold text-[#17221B] mb-5">
                                {food.price.toLocaleString()}
                                <span className="text-lg font-normal text-[#566B5D] ml-1">원</span>
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleWishlist}
                                    className={`flex items-center justify-center gap-2 flex-1 h-12 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${wishPop ? 'scale-105' : ''} ${
                                        isWishlisted
                                            ? 'border-[#F5762E] bg-[#FEF0E7] text-[#F5762E]'
                                            : 'border-[#D8E8DC] text-[#566B5D] hover:border-[#F5762E] hover:text-[#F5762E] hover:bg-[#FEF0E7]'
                                    }`}
                                    aria-label={isWishlisted ? '찜 해제' : '찜하기'}
                                >
                                    <svg viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5" aria-hidden="true">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                    {isWishlisted ? '찜 해제' : '찜하기'}
                                </button>

                                <button
                                    onClick={handleAddToCart}
                                    className={`flex items-center justify-center gap-2 flex-[2] h-12 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${cartPop ? 'scale-105' : ''} ${
                                        isInCart
                                            ? 'bg-[#EAF4EE] text-[#2A7A4B] border-2 border-[#2A7A4B]/20'
                                            : 'bg-[#2A7A4B] hover:bg-[#3D9960] text-white'
                                    }`}
                                    aria-label={isInCart ? '장바구니에 담김' : '장바구니 담기'}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5" aria-hidden="true">
                                        {isInCart ? (
                                            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                        ) : (
                                            <>
                                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                                <line x1="3" y1="6" x2="21" y2="6" />
                                                <path d="M16 10a4 4 0 0 1-8 0" />
                                            </>
                                        )}
                                    </svg>
                                    {isInCart ? '장바구니에 담김' : '장바구니 담기'}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Consumer Nutrition Chart ── */}
                <section className="bg-white rounded-2xl border border-[#D8E8DC] p-8 shadow-sm mb-8" aria-label="소비자별 영양 분석">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-[#17221B] mb-1">소비자별 영양 달성률</h2>
                        <p className="text-sm text-[#566B5D]">소비자 유형을 선택하면 1일 권장 섭취량 대비 이 제품의 달성률을 확인할 수 있어요.</p>
                    </div>

                    {/* Consumer type selector */}
                    <div className="flex flex-wrap gap-2 mb-7" role="tablist" aria-label="소비자 유형 선택">
                        {(Object.entries(CONSUMER_PROFILES) as [ConsumerType, typeof CONSUMER_PROFILES[ConsumerType]][]).map(([key, p]) => (
                            <button
                                key={key}
                                role="tab"
                                aria-selected={activeConsumer === key}
                                onClick={() => setActiveConsumer(key)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                                    activeConsumer === key
                                        ? 'bg-[#2A7A4B] border-[#2A7A4B] text-white shadow-md shadow-[#2A7A4B]/20'
                                        : 'bg-white border-[#D8E8DC] text-[#566B5D] hover:border-[#2A7A4B]/40 hover:text-[#2A7A4B]'
                                }`}
                            >
                                <span aria-hidden="true">{p.emoji}</span>
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Profile description + insight */}
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#EEF5F0]">
                        <p className="text-xs text-[#9DB3A3]">{profile.desc} · 1회 제공량 {food.servingSize} 기준</p>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EAF4EE] text-[#2A7A4B]">
              {profile.emoji} {best.label} {((food[best.key as keyof Food] as number) / rda[best.key] * 100).toFixed(1)}% 달성
            </span>
                    </div>

                    {/* Bars */}
                    <div className="space-y-5" role="tabpanel">
                        {NUTRIENT_CONFIG.map((n) => (
                            <NutritionBar
                                key={n.key}
                                label={n.label}
                                unit={n.unit}
                                value={food[n.key as keyof Food] as number}
                                max={rda[n.key]}
                                color={n.color}
                                bg={n.bg}
                            />
                        ))}
                    </div>
                </section>

                {/* ── Recommendations ── */}
                {recommendations.length > 0 && (
                    <section className="mb-8" aria-label="비슷한 상품 추천">
                        <h2 className="text-lg font-bold text-[#17221B] mb-4">
                            비슷한 상품 추천
                            <span className="text-sm font-normal text-[#9DB3A3] ml-2">{food.category} 카테고리</span>
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {recommendations.map((rec) => {
                                const cs = categoryColors[rec.category] ?? { bg: 'bg-gray-100', text: 'text-gray-600' };
                                return (
                                    <button
                                        key={rec.id}
                                        onClick={() => onFoodClick(rec.id)}
                                        className="group bg-white rounded-xl border border-[#D8E8DC] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-[#2A7A4B]/30 transition-all duration-200 text-left"
                                        aria-label={`${rec.name} 상세 보기`}
                                    >
                                        <div className="aspect-square overflow-hidden bg-[#F4F8F5]">
                                            <img
                                                src={rec.imageUrl}
                                                alt={rec.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        </div>
                                        <div className="p-3">
                                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${cs.bg} ${cs.text}`}>{rec.category}</span>
                                            <p className="text-xs font-semibold text-[#17221B] mt-1.5 line-clamp-2 leading-snug">{rec.name}</p>
                                            <p className="text-xs font-bold text-[#2A7A4B] mt-1.5">{rec.price.toLocaleString()}원</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* ── Reviews ── */}
                <section className="mb-16" aria-label="구매 리뷰">
                    <h2 className="text-lg font-bold text-[#17221B] mb-5">구매 리뷰</h2>

                    {/* Rating summary */}
                    <div className="bg-white rounded-2xl border border-[#D8E8DC] p-6 shadow-sm mb-4 flex items-center gap-8">
                        <div className="text-center shrink-0">
                            <p className="text-5xl font-bold text-[#17221B] leading-none">{avgRating.toFixed(1)}</p>
                            <Stars rating={avgRating} size="md" />
                            <p className="text-xs text-[#9DB3A3] mt-1.5">{reviews.length}개 리뷰</p>
                        </div>
                        <div className="flex-1 space-y-1.5">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = reviews.filter((r) => r.rating === star).length;
                                const pct = (count / reviews.length) * 100;
                                return (
                                    <div key={star} className="flex items-center gap-2">
                                        <span className="text-xs text-[#566B5D] w-4 text-right">{star}</span>
                                        <svg viewBox="0 0 12 12" className="w-3 h-3 shrink-0" aria-hidden="true">
                                            <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9 3 10.5l.5-3.5L1 4.5 4.5 4z" fill="#F5762E" />
                                        </svg>
                                        <div className="flex-1 h-1.5 bg-[#F4F8F5] rounded-full overflow-hidden">
                                            <div className="h-full bg-[#F5762E] rounded-full transition-all" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="text-xs text-[#9DB3A3] w-4">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Review cards */}
                    <div className="space-y-3">
                        {reviews.map((review) => (
                            <article key={review.id} className="bg-white rounded-xl border border-[#D8E8DC] p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#EAF4EE] to-[#D8E8DC] flex items-center justify-center text-[#2A7A4B] font-bold text-sm shrink-0">
                                            {review.user.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#17221B]">{review.user}</p>
                                            <div className="flex items-center gap-1.5">
                                                <Stars rating={review.rating} size="sm" />
                                                <span className="text-[11px] text-[#9DB3A3]">{review.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        {review.tags.map((tag) => (
                                            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F4F8F5] text-[#566B5D]">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-[#17221B] leading-relaxed mb-3">{review.content}</p>
                                <button className="flex items-center gap-1.5 text-xs text-[#9DB3A3] hover:text-[#566B5D] transition-colors">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5" aria-hidden="true">
                                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                                        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                    </svg>
                                    도움이 됐어요 {review.helpful}
                                </button>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
