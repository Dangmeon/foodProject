import { useState } from 'react';
import { Food } from '../data/mockFoods';

interface ComparePageProps {
    foods: Food[];
    compareIds: Set<number>;
    onBack: () => void;
    onChangeTargets: () => void;
    wishlist: Set<number>;
    cartFoodIds: Set<number>;
    onToggleWishlist: (id: number) => void;
    onAddToCart: (food: Food) => void;
    onFoodClick: (id: number) => void;
}

interface CompareRow {
    key: keyof Food;
    label: string;
    unit: string;
    bestFn: 'min' | 'max';
    format?: (v: number) => string;
    icon: string;
}

const COMPARE_ROWS: CompareRow[] = [
    { key: 'price', label: '가격', unit: '원', bestFn: 'min', format: (v) => v.toLocaleString(), icon: '💰' },
    { key: 'calories', label: '칼로리', unit: 'kcal', bestFn: 'min', icon: '🔥' },
    { key: 'protein', label: '단백질', unit: 'g', bestFn: 'max', icon: '💪' },
    { key: 'sugar', label: '당류', unit: 'g', bestFn: 'min', icon: '🍬' },
    { key: 'fat', label: '지방', unit: 'g', bestFn: 'min', icon: '🥑' },
    { key: 'carbs', label: '탄수화물', unit: 'g', bestFn: 'min', icon: '🌾' },
    { key: 'sodium', label: '나트륨', unit: 'mg', bestFn: 'min', icon: '🧂' },
];

function getValueClass(val: number, bestVal: number, worstVal: number, allEqual: boolean) {
    if (allEqual) return { cell: '', text: 'text-slate-800', badge: null };
    if (val === bestVal) return { cell: 'bg-emerald-50', text: 'text-emerald-700 font-extrabold', badge: 'best' };
    if (val === worstVal) return { cell: 'bg-rose-50', text: 'text-rose-600', badge: null };
    return { cell: '', text: 'text-slate-800', badge: null };
}

export default function ComparePage({
                                        foods,
                                        compareIds,
                                        onBack,
                                        onChangeTargets,
                                        wishlist,
                                        cartFoodIds,
                                        onToggleWishlist,
                                        onAddToCart,
                                        onFoodClick,
                                    }: ComparePageProps) {
    const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
    const products = foods.filter((f) => compareIds.has(f.id));

    return (
        <div className="min-h-screen bg-[#F5F7FA]">
            {/* Page header */}
            <div className="bg-white border-b border-slate-200 sticky top-[60px] z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                        목록으로
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-indigo-100 rounded-md flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" className="w-3.5 h-3.5" aria-hidden="true">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                            </svg>
                        </div>
                        <h1 className="text-base font-bold text-slate-900">
                            제품 비교
                            <span className="ml-2 text-sm font-normal text-slate-400">{products.length}개 제품</span>
                        </h1>
                    </div>
                    <button
                        onClick={onChangeTargets}
                        className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        비교 대상 변경
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Product header cards */}
                <div
                    className="grid gap-4 mb-6"
                    style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}
                >
                    <div className="flex items-end pb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">비교 항목</span>
                    </div>
                    {products.map((p) => (
                        <div
                            key={p.id}
                            className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col items-center gap-3 text-center cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => onFoodClick(p.id)}
                        >
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                                {!imgErrors.has(p.id) ? (
                                    <img
                                        src={p.imageUrl}
                                        alt={p.name}
                                        className="w-full h-full object-cover"
                                        onError={() => setImgErrors((prev) => new Set([...prev, p.id]))}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8" aria-hidden="true">
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-400 font-medium">{p.brand}</p>
                                <h3 className="text-sm font-bold text-slate-900 leading-snug mt-0.5 line-clamp-2">
                                    {p.name}
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-1">{p.servingSize} 기준</p>
                            </div>
                            <div className="flex gap-2 mt-auto">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onToggleWishlist(p.id); }}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors ${wishlist.has(p.id) ? 'border-orange-200 text-orange-500 bg-orange-50' : 'border-slate-200 text-slate-400 hover:text-orange-500'}`}
                                    aria-label={wishlist.has(p.id) ? '찜 해제' : '찜하기'}
                                >
                                    <svg viewBox="0 0 24 24" fill={wishlist.has(p.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5" aria-hidden="true">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onAddToCart(p); }}
                                    className={`flex-1 h-8 rounded-lg text-xs font-semibold transition-colors ${cartFoodIds.has(p.id) ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-[#2A7A4B] text-white hover:bg-[#3D9960]'}`}
                                >
                                    {cartFoodIds.has(p.id) ? '담겼음' : '담기'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comparison table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                        <div className="w-1.5 h-5 bg-indigo-500 rounded-full" aria-hidden="true" />
                        <h2 className="text-sm font-bold text-slate-700">영양 성분 비교</h2>
                        <span className="text-xs text-slate-400 ml-1">— 초록: 최적값 · 빨강: 개선 여지</span>
                    </div>

                    {COMPARE_ROWS.map((row, rowIdx) => {
                        const values = products.map((p) => p[row.key] as number);
                        const bestVal = row.bestFn === 'min' ? Math.min(...values) : Math.max(...values);
                        const worstVal = row.bestFn === 'min' ? Math.max(...values) : Math.min(...values);
                        const allEqual = values.every((v) => v === values[0]);

                        return (
                            <div
                                key={row.key}
                                className={`grid ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                                style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}
                            >
                                {/* Row label */}
                                <div className="px-6 py-4 flex items-center gap-2.5 border-r border-slate-100">
                                    <span className="text-base leading-none" aria-hidden="true">{row.icon}</span>
                                    <span className="text-sm font-semibold text-slate-600">{row.label}</span>
                                </div>

                                {/* Product values */}
                                {products.map((p) => {
                                    const val = p[row.key] as number;
                                    const { cell, text, badge } = getValueClass(val, bestVal, worstVal, allEqual);
                                    return (
                                        <div
                                            key={p.id}
                                            className={`px-6 py-4 flex items-center justify-center gap-2 border-r border-slate-100 last:border-r-0 ${cell}`}
                                        >
                      <span className={`text-lg tabular-nums ${text}`}>
                        {row.format ? row.format(val) : val}
                      </span>
                                            <span className="text-xs text-slate-400">{row.unit}</span>
                                            {badge === 'best' && (
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full leading-none">
                          best
                        </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                {/* Summary insight */}
                <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" className="w-4 h-4 shrink-0" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4l2 2" />
                        </svg>
                        <h3 className="text-sm font-bold text-indigo-700">비교 요약</h3>
                    </div>
                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${products.length}, 1fr)` }}>
                        {products.map((p) => {
                            const bestCount = COMPARE_ROWS.filter((row) => {
                                const values = products.map((f) => f[row.key] as number);
                                const allEqual = values.every((v) => v === values[0]);
                                if (allEqual) return false;
                                const bestVal = row.bestFn === 'min' ? Math.min(...values) : Math.max(...values);
                                return (p[row.key] as number) === bestVal;
                            }).length;

                            return (
                                <div key={p.id} className="bg-white rounded-xl p-3.5 text-center border border-indigo-100">
                                    <p className="text-xs text-slate-500 truncate mb-1">{p.name}</p>
                                    <p className="text-2xl font-black text-indigo-600 tabular-nums">{bestCount}</p>
                                    <p className="text-[11px] text-slate-400">항목 최적</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
