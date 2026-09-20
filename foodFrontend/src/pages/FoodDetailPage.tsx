import { useEffect, useState } from 'react';
import { Food } from '@/type/mockFoods';
import { FoodDetail } from '@/type/foodDetail';

type ConsumerType =
    | 'general'
    | 'dieter'
    | 'fitness'
    | 'diabetic'
    | 'child';

interface RDA {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    sugar: number;
}

interface FoodDetailPageProps {
    food: FoodDetail;

    // 목록에서 가지고 있던 정보
    // 이미지 / 임시 가격 / 장바구니 처리를 위해 사용
    listFood?: Food | null;

    isWishlisted: boolean;
    isInCart: boolean;

    onToggleWishlist: (id: number) => void;
    onAddToCart: (food: Food) => void;

    onBack: () => void;

    allFoods: Food[];
    onFoodClick: (id: number) => void;
}

/* =========================================================
   소비자 유형별 임시 권장량
   ========================================================= */

const CONSUMER_PROFILES: Record<
    ConsumerType,
    {
        label: string;
        emoji: string;
        desc: string;
        rda: RDA;
    }
> = {
    general: {
        label: '일반인',
        emoji: '🧑',
        desc: '성인 평균 2,000kcal 기준',
        rda: {
            calories: 2000,
            protein: 55,
            fat: 54,
            carbs: 324,
            sugar: 100,
        },
    },

    dieter: {
        label: '다이어터',
        emoji: '🥗',
        desc: '칼로리 제한 1,500kcal 기준',
        rda: {
            calories: 1500,
            protein: 65,
            fat: 42,
            carbs: 200,
            sugar: 30,
        },
    },

    fitness: {
        label: '헬스인',
        emoji: '💪',
        desc: '고강도 훈련 2,800kcal 기준',
        rda: {
            calories: 2800,
            protein: 140,
            fat: 78,
            carbs: 350,
            sugar: 50,
        },
    },

    diabetic: {
        label: '당 관리',
        emoji: '🩸',
        desc: '혈당 관리 1,800kcal 기준',
        rda: {
            calories: 1800,
            protein: 60,
            fat: 50,
            carbs: 225,
            sugar: 25,
        },
    },

    child: {
        label: '어린이',
        emoji: '👧',
        desc: '초등학생 1,700kcal 기준',
        rda: {
            calories: 1700,
            protein: 35,
            fat: 57,
            carbs: 270,
            sugar: 60,
        },
    },
};

/* =========================================================
   FoodDetail 필드명과 RDA 필드명이 다르기 때문에
   foodKey / rdaKey 분리
   ========================================================= */

type NutrientFoodKey =
    | 'calories'
    | 'protein'
    | 'fat'
    | 'carbohydrate'
    | 'sugar';

interface NutrientConfig {
    foodKey: NutrientFoodKey;
    rdaKey: keyof RDA;
    label: string;
    unit: string;
    color: string;
    bg: string;
}

const NUTRIENT_CONFIG: NutrientConfig[] = [
    {
        foodKey: 'calories',
        rdaKey: 'calories',
        label: '칼로리',
        unit: 'kcal',
        color: '#F5762E',
        bg: '#FEF0E7',
    },
    {
        foodKey: 'protein',
        rdaKey: 'protein',
        label: '단백질',
        unit: 'g',
        color: '#2A7A4B',
        bg: '#EAF4EE',
    },
    {
        foodKey: 'fat',
        rdaKey: 'fat',
        label: '지방',
        unit: 'g',
        color: '#8B5CF6',
        bg: '#F5F3FF',
    },
    {
        foodKey: 'carbohydrate',
        rdaKey: 'carbs',
        label: '탄수화물',
        unit: 'g',
        color: '#F59E0B',
        bg: '#FFFBEB',
    },
    {
        foodKey: 'sugar',
        rdaKey: 'sugar',
        label: '당류',
        unit: 'g',
        color: '#0EA5E9',
        bg: '#F0F9FF',
    },
];

/* =========================================================
   리뷰는 아직 실제 DB가 아니라 Mock
   ========================================================= */

const REVIEW_POOL = [
    {
        user: '건강러버김*수',
        rating: 5,
        content:
            '운동 후 먹기에 완벽한 영양 공급원이에요. 맛도 생각보다 훨씬 좋아서 매일 챙겨 먹고 있어요!',
        helpful: 24,
        tags: ['재구매 의사 있음', '맛있어요'],
    },
    {
        user: '다이어트중박*진',
        rating: 4,
        content:
            '칼로리가 낮아서 다이어트할 때 부담 없이 먹을 수 있어요. 포만감도 오래 가고요.',
        helpful: 18,
        tags: ['포만감 좋음', '다이어트 추천'],
    },
    {
        user: '헬린이이*현',
        rating: 5,
        content:
            '단백질 함량이 높아서 운동 목표 달성에 큰 도움이 되고 있어요. 가격 대비 만족스럽습니다.',
        helpful: 31,
        tags: ['고단백', '가성비 좋음'],
    },
    {
        user: '건강식단최*영',
        rating: 3,
        content:
            '영양성분은 훌륭한데 맛이 조금 아쉽네요. 건강을 위해 계속 먹고 있습니다.',
        helpful: 7,
        tags: ['영양가 높음'],
    },
    {
        user: '요리유튜버정*아',
        rating: 4,
        content:
            '요리에 활용하기도 좋고 그냥 먹어도 맛있어요. 가족들도 모두 좋아하는 제품이에요.',
        helpful: 15,
        tags: ['맛있어요', '활용도 높음'],
    },
    {
        user: '영양사오*우',
        rating: 5,
        content:
            '영양 성분 밸런스가 훌륭해요. 주변에도 적극 추천하는 제품입니다.',
        helpful: 42,
        tags: ['전문가 추천', '영양 밸런스'],
    },
];

/* =========================================================
   별점
   ========================================================= */

function Stars({
                   rating,
                   size = 'sm',
               }: {
    rating: number;
    size?: 'sm' | 'md' | 'lg';
}) {
    const dim =
        size === 'lg'
            ? 'w-6 h-6'
            : size === 'md'
                ? 'w-5 h-5'
                : 'w-3.5 h-3.5';

    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <svg
                    key={i}
                    viewBox="0 0 24 24"
                    className={dim}
                    aria-hidden="true"
                >
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

/* =========================================================
   영양 달성률 그래프
   ========================================================= */

function NutritionBar({
                          label,
                          unit,
                          value,
                          max,
                          color,
                      }: {
    label: string;
    unit: string;
    value: number;
    max: number;
    color: string;
}) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    const actualPct = max > 0 ? (value / max) * 100 : 0;

    const overflow = actualPct > 100;
    const isHigh = pct >= 50;

    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">

          <span className="text-sm font-semibold text-[#17221B] w-16">
            {label}
          </span>

                    <span className="text-xs text-[#566B5D]">
            {value}
                        {unit}
          </span>

                    {overflow && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600">
              초과
            </span>
                    )}

                </div>

                <div className="flex items-center gap-2">

          <span className="text-xs text-[#9DB3A3]">
            권장량 {max}
              {unit}
          </span>

                    <span
                        className={`text-xs font-bold min-w-[44px] text-right ${
                            overflow
                                ? 'text-rose-500'
                                : isHigh
                                    ? 'text-amber-500'
                                    : 'text-[#566B5D]'
                        }`}
                    >
            {actualPct.toFixed(1)}%
          </span>

                </div>
            </div>

            <div className="h-2.5 rounded-full overflow-hidden bg-[#F4F8F5]">
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

/* =========================================================
   상세 정보 한 칸
   ========================================================= */

function DetailItem({
                        label,
                        value,
                    }: {
    label: string;
    value?: string | number | null;
}) {
    const empty =
        value === null ||
        value === undefined ||
        value === '';

    return (
        <div>
            <p className="text-xs text-[#9DB3A3] mb-1">
                {label}
            </p>

            <p className="text-sm font-semibold text-[#17221B]">
                {empty ? '정보 없음' : value}
            </p>
        </div>
    );
}

function formatNumber(
    value: number | null | undefined,
    unit: string,
) {
    if (value === null || value === undefined) {
        return '정보 없음';
    }

    return `${value}${unit}`;
}

/* =========================================================
   상세페이지
   ========================================================= */

export default function FoodDetailPage({
                                           food,
                                           listFood,
                                           isWishlisted,
                                           isInCart,
                                           onToggleWishlist,
                                           onAddToCart,
                                           onBack,
                                           allFoods,
                                           onFoodClick,
                                       }: FoodDetailPageProps) {
    const [activeConsumer, setActiveConsumer] =
        useState<ConsumerType>('general');

    const [imgError, setImgError] = useState(false);
    const [cartPop, setCartPop] = useState(false);
    const [wishPop, setWishPop] = useState(false);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        setImgError(false);
    }, [food.foodId]);

    const profile = CONSUMER_PROFILES[activeConsumer];
    const { rda } = profile;

    /* =======================================================
       목록 데이터
       상세 API에는 현재 이미지 / 가격이 없기 때문
       ======================================================= */

    const imageUrl = listFood?.imageUrl;
    const price = listFood?.price;

    /* =======================================================
       추천 상품

       현재 목록 Food에는 category 하나만 있으므로
       상세 데이터의 majorCategoryCode와 비교한다.
       ======================================================= */

    const recommendations = allFoods
        .filter(
            (item) =>
                item.id !== food.foodId &&
                item.category === food.majorCategoryCode,
        )
        .slice(0, 4);

    /* =======================================================
       리뷰 Mock
       ======================================================= */

    const reviews = [0, 1, 2].map((i) => ({
        ...REVIEW_POOL[
        (food.foodId + i) % REVIEW_POOL.length
            ],

        id: i,

        date: `2026.0${Math.max(
            7,
            9 - i,
        )}.${String(
            10 + ((food.foodId * 3 + i * 7) % 20),
        ).padStart(2, '0')}`,
    }));

    const avgRating =
        reviews.reduce(
            (sum, review) => sum + review.rating,
            0,
        ) / reviews.length;

    /* =======================================================
       영양 달성률
       ======================================================= */

    const coverages = NUTRIENT_CONFIG.map((nutrient) => {
        const rawValue = food[nutrient.foodKey];

        const value =
            typeof rawValue === 'number'
                ? rawValue
                : 0;

        const max = rda[nutrient.rdaKey];

        return {
            ...nutrient,
            value,
            pct:
                max > 0
                    ? (value / max) * 100
                    : 0,
        };
    });

    const best = coverages.reduce(
        (a, b) =>
            a.pct > b.pct
                ? a
                : b,
    );

    /* =======================================================
       이벤트
       ======================================================= */

    const handleWishlist = () => {
        onToggleWishlist(food.foodId);

        setWishPop(true);

        setTimeout(() => {
            setWishPop(false);
        }, 300);
    };

    const handleAddToCart = () => {
        if (!listFood) {
            console.warn(
                '장바구니에 추가할 목록용 Food 데이터가 없습니다.',
            );
            return;
        }

        onAddToCart(listFood);

        setCartPop(true);

        setTimeout(() => {
            setCartPop(false);
        }, 400);
    };

    return (
        <div className="min-h-screen bg-[#F4F8F5] pt-16">

            <div className="max-w-7xl mx-auto px-6 lg:px-10">

                {/* =================================================
            뒤로가기
            ================================================= */}

                <div className="pt-8 pb-5">

                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-sm text-[#566B5D] hover:text-[#2A7A4B] transition-colors group"
                    >

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
                            aria-hidden="true"
                        >
                            <path
                                d="M19 12H5M12 5l-7 7 7 7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        검색 목록으로

                    </button>

                </div>

                {/* =================================================
            상단 제품 요약
            ================================================= */}

                <section className="bg-white rounded-2xl border border-[#D8E8DC] shadow-sm p-6 mb-8">

                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* 이미지 */}

                        <div className="w-full lg:w-[300px] shrink-0">

                            <div className="aspect-square rounded-xl overflow-hidden bg-[#F4F8F5] border border-[#EEF5F0]">

                                {imageUrl && !imgError ? (

                                    <img
                                        src={imageUrl}
                                        alt={food.foodName}
                                        className="w-full h-full object-cover"
                                        onError={() =>
                                            setImgError(true)
                                        }
                                    />

                                ) : (

                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#9DB3A3]">

                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            className="w-12 h-12 opacity-40"
                                        >
                                            <rect
                                                x="3"
                                                y="3"
                                                width="18"
                                                height="18"
                                                rx="2"
                                            />

                                            <circle
                                                cx="8.5"
                                                cy="8.5"
                                                r="1.5"
                                            />

                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>

                                        <span className="text-sm">
                      이미지 없음
                    </span>

                                    </div>

                                )}

                            </div>

                        </div>

                        {/* 제품 정보 */}

                        <div className="flex-1 min-w-0 flex flex-col">

                            {/* 대/중/소 카테고리 */}

                            <div className="flex flex-wrap gap-2 mb-4">

                                {food.majorCategoryCode && (
                                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#EAF4EE] text-[#2A7A4B] font-semibold">
                    {food.majorCategoryCode}
                  </span>
                                )}

                                {food.midCategoryCode && (
                                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold">
                    {food.midCategoryCode}
                  </span>
                                )}

                                {food.minorCategoryCode && (
                                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold">
                    {food.minorCategoryCode}
                  </span>
                                )}

                            </div>

                            <p className="text-sm text-[#566B5D] font-medium mb-1">
                                {food.manufacturer ||
                                    '제조사 정보 없음'}
                            </p>

                            <h1 className="text-2xl font-bold text-[#17221B] leading-snug mb-4">
                                {food.foodName}
                            </h1>

                            {/* 리뷰 요약 */}

                            <div className="flex items-center gap-2 mb-5">

                                <Stars
                                    rating={avgRating}
                                    size="sm"
                                />

                                <span className="text-sm font-semibold text-[#17221B]">
                  {avgRating.toFixed(1)}
                </span>

                                <span className="text-sm text-[#9DB3A3]">
                  ({reviews.length}개 리뷰)
                </span>

                            </div>

                            {/* 주요 영양정보 */}

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">

                                <div className="bg-[#FEF0E7] rounded-xl p-3 text-center">

                                    <strong className="block text-lg text-[#F5762E]">
                                        {food.calories ?? 0}
                                        <span className="text-sm ml-0.5">
                      kcal
                    </span>
                                    </strong>

                                    <span className="text-xs text-[#566B5D]">
                    칼로리
                  </span>

                                </div>

                                <div className="bg-[#EAF4EE] rounded-xl p-3 text-center">

                                    <strong className="block text-lg text-[#2A7A4B]">
                                        {food.protein ?? 0}
                                        <span className="text-sm ml-0.5">
                      g
                    </span>
                                    </strong>

                                    <span className="text-xs text-[#566B5D]">
                    단백질
                  </span>

                                </div>

                                <div className="bg-sky-50 rounded-xl p-3 text-center">

                                    <strong className="block text-lg text-sky-600">
                                        {food.sugar ?? 0}
                                        <span className="text-sm ml-0.5">
                      g
                    </span>
                                    </strong>

                                    <span className="text-xs text-[#566B5D]">
                    당류
                  </span>

                                </div>

                                <div className="bg-violet-50 rounded-xl p-3 text-center">

                                    <strong className="block text-lg text-violet-600">
                                        {food.fat ?? 0}
                                        <span className="text-sm ml-0.5">
                      g
                    </span>
                                    </strong>

                                    <span className="text-xs text-[#566B5D]">
                    지방
                  </span>

                                </div>

                            </div>

                            <p className="text-sm text-[#9DB3A3] mb-5">
                                1회 제공량:{' '}
                                {food.servingSize ||
                                    '정보 없음'}
                            </p>

                            <div className="mt-auto">

                                {price !== undefined && (

                                    <p className="text-2xl font-bold text-[#17221B] mb-5">

                                        {price.toLocaleString()}

                                        <span className="text-base font-normal text-[#566B5D] ml-1">
                      원
                    </span>

                                    </p>

                                )}

                                <div className="flex gap-3">

                                    {/* 찜 */}

                                    <button
                                        onClick={handleWishlist}
                                        className={`flex-1 h-12 rounded-xl border-2 font-semibold text-sm transition-all ${
                                            wishPop
                                                ? 'scale-105'
                                                : ''
                                        } ${
                                            isWishlisted
                                                ? 'border-[#F5762E] bg-[#FEF0E7] text-[#F5762E]'
                                                : 'border-[#D8E8DC] text-[#566B5D] hover:border-[#F5762E] hover:text-[#F5762E]'
                                        }`}
                                    >
                                        {isWishlisted
                                            ? '찜 해제'
                                            : '찜하기'}
                                    </button>

                                    {/* 장바구니 */}

                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!listFood}
                                        className={`flex-[2] h-12 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 ${
                                            cartPop
                                                ? 'scale-105'
                                                : ''
                                        } ${
                                            isInCart
                                                ? 'bg-[#EAF4EE] text-[#2A7A4B] border-2 border-[#2A7A4B]/20'
                                                : 'bg-[#2A7A4B] hover:bg-[#3D9960] text-white'
                                        }`}
                                    >
                                        {isInCart
                                            ? '장바구니에 담김'
                                            : '장바구니 담기'}
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* =================================================
            제품 상세 정보
            ================================================= */}

                <section className="bg-white rounded-2xl border border-[#D8E8DC] shadow-sm p-7 mb-8">

                    <div className="mb-6">

                        <h2 className="text-lg font-bold text-[#17221B]">
                            제품 상세 정보
                        </h2>

                        <p className="text-sm text-[#566B5D] mt-1">
                            제품 분류와 상세 영양 정보를 확인할 수 있습니다.
                        </p>

                    </div>

                    {/* 카테고리 */}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pb-6 mb-6 border-b border-[#EEF5F0]">

                        <DetailItem
                            label="대분류"
                            value={food.majorCategoryCode}
                        />

                        <DetailItem
                            label="중분류"
                            value={food.midCategoryCode}
                        />

                        <DetailItem
                            label="소분류"
                            value={food.minorCategoryCode}
                        />

                    </div>

                    {/* 제품 기본정보 */}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pb-6 mb-6 border-b border-[#EEF5F0]">

                        <DetailItem
                            label="총 중량"
                            value={food.totalWeight}
                        />

                        <DetailItem
                            label="원산지"
                            value={food.origin}
                        />

                        <DetailItem
                            label="1회 제공량"
                            value={food.servingSize}
                        />

                    </div>

                    {/* 상세 영양 */}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">

                        <DetailItem
                            label="탄수화물"
                            value={formatNumber(
                                food.carbohydrate,
                                'g',
                            )}
                        />

                        <DetailItem
                            label="나트륨"
                            value={formatNumber(
                                food.sodium,
                                'mg',
                            )}
                        />

                        <DetailItem
                            label="콜레스테롤"
                            value={formatNumber(
                                food.cholesterol,
                                'mg',
                            )}
                        />

                        <DetailItem
                            label="포화지방"
                            value={formatNumber(
                                food.saturatedFat,
                                'g',
                            )}
                        />

                        <DetailItem
                            label="트랜스지방"
                            value={formatNumber(
                                food.transFat,
                                'g',
                            )}
                        />

                        <DetailItem
                            label="단백질"
                            value={formatNumber(
                                food.protein,
                                'g',
                            )}
                        />

                        <DetailItem
                            label="당류"
                            value={formatNumber(
                                food.sugar,
                                'g',
                            )}
                        />

                        <DetailItem
                            label="지방"
                            value={formatNumber(
                                food.fat,
                                'g',
                            )}
                        />

                    </div>

                </section>

                {/* =================================================
            소비자별 영양 달성률
            기존 그래프 유지
            ================================================= */}

                <section
                    className="bg-white rounded-2xl border border-[#D8E8DC] p-8 shadow-sm mb-8"
                    aria-label="소비자별 영양 분석"
                >

                    <div className="mb-6">

                        <h2 className="text-lg font-bold text-[#17221B] mb-1">
                            소비자별 영양 달성률
                        </h2>

                        <p className="text-sm text-[#566B5D]">
                            소비자 유형을 선택하면 1일 권장 섭취량 대비 이 제품의 달성률을 확인할 수 있어요.
                        </p>

                    </div>

                    {/* 사용자 유형 */}

                    <div
                        className="flex flex-wrap gap-2 mb-7"
                        role="tablist"
                        aria-label="소비자 유형 선택"
                    >

                        {(
                            Object.entries(
                                CONSUMER_PROFILES,
                            ) as [
                                ConsumerType,
                                typeof CONSUMER_PROFILES[ConsumerType],
                            ][]
                        ).map(([key, value]) => (

                            <button
                                key={key}
                                role="tab"
                                aria-selected={
                                    activeConsumer === key
                                }
                                onClick={() =>
                                    setActiveConsumer(key)
                                }
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                                    activeConsumer === key
                                        ? 'bg-[#2A7A4B] border-[#2A7A4B] text-white shadow-md'
                                        : 'bg-white border-[#D8E8DC] text-[#566B5D] hover:border-[#2A7A4B]/40'
                                }`}
                            >

                <span>
                  {value.emoji}
                </span>

                                {value.label}

                            </button>

                        ))}

                    </div>

                    {/* 설명 */}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 pb-4 border-b border-[#EEF5F0]">

                        <p className="text-xs text-[#9DB3A3]">
                            {profile.desc}
                            {' · '}
                            1회 제공량{' '}
                            {food.servingSize ||
                                '정보 없음'}{' '}
                            기준
                        </p>

                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EAF4EE] text-[#2A7A4B] w-fit">
              {profile.emoji}{' '}
                            {best.label}{' '}
                            {best.pct.toFixed(1)}% 달성
            </span>

                    </div>

                    {/* 그래프 */}

                    <div className="space-y-5">

                        {coverages.map((nutrient) => (

                            <NutritionBar
                                key={nutrient.foodKey}
                                label={nutrient.label}
                                unit={nutrient.unit}
                                value={nutrient.value}
                                max={
                                    rda[
                                        nutrient.rdaKey
                                        ]
                                }
                                color={nutrient.color}
                            />

                        ))}

                    </div>

                </section>

                {/* =================================================
            비슷한 상품 추천
            ================================================= */}

                {recommendations.length > 0 && (

                    <section
                        className="mb-8"
                        aria-label="비슷한 상품 추천"
                    >

                        <h2 className="text-lg font-bold text-[#17221B] mb-4">

                            비슷한 상품 추천

                            <span className="text-sm font-normal text-[#9DB3A3] ml-2">
                {food.majorCategoryCode}
              </span>

                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                            {recommendations.map(
                                (rec) => (

                                    <button
                                        key={rec.id}
                                        onClick={() =>
                                            onFoodClick(
                                                rec.id,
                                            )
                                        }
                                        className="group bg-white rounded-xl border border-[#D8E8DC] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
                                    >

                                        <div className="aspect-square overflow-hidden bg-[#F4F8F5]">

                                            {rec.imageUrl && (

                                                <img
                                                    src={
                                                        rec.imageUrl
                                                    }
                                                    alt={rec.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />

                                            )}

                                        </div>

                                        <div className="p-3">

                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#EAF4EE] text-[#2A7A4B]">
                        {rec.category}
                      </span>

                                            <p className="text-xs font-semibold text-[#17221B] mt-1.5 line-clamp-2 leading-snug">
                                                {rec.name}
                                            </p>

                                            <p className="text-xs font-bold text-[#2A7A4B] mt-1.5">
                                                {rec.price.toLocaleString()}
                                                원
                                            </p>

                                        </div>

                                    </button>

                                ),
                            )}

                        </div>

                    </section>

                )}

                {/* =================================================
            구매 리뷰
            기존 리뷰 유지
            ================================================= */}

                <section
                    className="mb-16"
                    aria-label="구매 리뷰"
                >

                    <h2 className="text-lg font-bold text-[#17221B] mb-5">
                        구매 리뷰
                    </h2>

                    {/* 리뷰 요약 */}

                    <div className="bg-white rounded-2xl border border-[#D8E8DC] p-6 shadow-sm mb-4 flex items-center gap-8">

                        <div className="text-center shrink-0">

                            <p className="text-5xl font-bold text-[#17221B] leading-none mb-2">
                                {avgRating.toFixed(1)}
                            </p>

                            <Stars
                                rating={avgRating}
                                size="md"
                            />

                            <p className="text-xs text-[#9DB3A3] mt-1.5">
                                {reviews.length}개 리뷰
                            </p>

                        </div>

                        {/* 별점 분포 */}

                        <div className="flex-1 space-y-1.5">

                            {[5, 4, 3, 2, 1].map(
                                (star) => {
                                    const count =
                                        reviews.filter(
                                            (review) =>
                                                review.rating ===
                                                star,
                                        ).length;

                                    const pct =
                                        reviews.length > 0
                                            ? (count /
                                                reviews.length) *
                                            100
                                            : 0;

                                    return (

                                        <div
                                            key={star}
                                            className="flex items-center gap-2"
                                        >

                      <span className="text-xs text-[#566B5D] w-4 text-right">
                        {star}
                      </span>

                                            <svg
                                                viewBox="0 0 12 12"
                                                className="w-3 h-3 shrink-0"
                                            >
                                                <path
                                                    d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9 3 10.5l.5-3.5L1 4.5 4.5 4z"
                                                    fill="#F5762E"
                                                />
                                            </svg>

                                            <div className="flex-1 h-1.5 bg-[#F4F8F5] rounded-full overflow-hidden">

                                                <div
                                                    className="h-full bg-[#F5762E] rounded-full transition-all"
                                                    style={{
                                                        width: `${pct}%`,
                                                    }}
                                                />

                                            </div>

                                            <span className="text-xs text-[#9DB3A3] w-4">
                        {count}
                      </span>

                                        </div>

                                    );
                                },
                            )}

                        </div>

                    </div>

                    {/* 리뷰 목록 */}

                    <div className="space-y-3">

                        {reviews.map(
                            (review) => (

                                <article
                                    key={review.id}
                                    className="bg-white rounded-xl border border-[#D8E8DC] p-5 shadow-sm"
                                >

                                    <div className="flex items-start justify-between gap-3 mb-3">

                                        <div className="flex items-center gap-3">

                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#EAF4EE] to-[#D8E8DC] flex items-center justify-center text-[#2A7A4B] font-bold text-sm shrink-0">
                                                {review.user.charAt(
                                                    0,
                                                )}
                                            </div>

                                            <div>

                                                <p className="text-sm font-semibold text-[#17221B]">
                                                    {review.user}
                                                </p>

                                                <div className="flex items-center gap-1.5">

                                                    <Stars
                                                        rating={
                                                            review.rating
                                                        }
                                                        size="sm"
                                                    />

                                                    <span className="text-[11px] text-[#9DB3A3]">
                            {review.date}
                          </span>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="flex flex-wrap justify-end gap-1">

                                            {review.tags.map(
                                                (tag) => (

                                                    <span
                                                        key={tag}
                                                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F4F8F5] text-[#566B5D]"
                                                    >
                            {tag}
                          </span>

                                                ),
                                            )}

                                        </div>

                                    </div>

                                    <p className="text-sm text-[#17221B] leading-relaxed mb-3">
                                        {review.content}
                                    </p>

                                    <button className="flex items-center gap-1.5 text-xs text-[#9DB3A3] hover:text-[#566B5D] transition-colors">

                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="w-3.5 h-3.5"
                                        >
                                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                                            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                        </svg>

                                        도움이 됐어요{' '}
                                        {review.helpful}

                                    </button>

                                </article>

                            ),
                        )}

                    </div>

                </section>

            </div>

        </div>
    );
}