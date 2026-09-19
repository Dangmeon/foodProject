interface PurposeMenuProps {
  activePurpose: string | null;
  onSelect: (id: string) => void;
}

const purposes = [
  { id: 'fitness', emoji: '💪', label: '헬스/근성장' },
  { id: 'diet', emoji: '🥗', label: '다이어터' },
  { id: 'sugar', emoji: '🩸', label: '당 관리' },
  { id: 'clean', emoji: '🌱', label: '클린 식단' },
  { id: 'protein', emoji: '🥩', label: '단백질 보충' },
  { id: 'energy', emoji: '⚡', label: '에너지 충전' },
  { id: 'lowfat', emoji: '🫙', label: '저지방' },
  { id: 'vegan', emoji: '🌿', label: '비건' },
];

export default function PurposeMenu({ activePurpose, onSelect }: PurposeMenuProps) {
  return (
      <section className="max-w-7xl mx-auto px-10 pt-6 pb-2" aria-label="목적별 맞춤 식품">
        {activePurpose && (
            <div className="flex justify-center mb-3">
              <button
                  onClick={() => onSelect(activePurpose)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors font-medium flex items-center gap-1"
                  aria-label="목적 선택 해제"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
                선택 해제
              </button>
            </div>
        )}

        <div className="flex flex-wrap justify-center gap-2.5" role="list" aria-label="목적 카테고리">
          {purposes.map((p) => {
            const isActive = activePurpose === p.id;
            return (
                <button
                    key={p.id}
                    onClick={() => onSelect(p.id)}
                    role="listitem"
                    aria-pressed={isActive}
                    aria-label={`${p.label} 필터 ${isActive ? '해제' : '적용'}`}
                    className={[
                      'flex flex-col items-center justify-center gap-1.5 w-[84px] aspect-square rounded-2xl border-2',
                      'transition-all duration-150 ease-out active:scale-95',
                      isActive
                          ? 'bg-[#2A7A4B] border-[#2A7A4B] shadow-md -translate-y-0.5'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm hover:shadow-md hover:-translate-y-0.5',
                    ].join(' ')}
                >
                  <span className="text-2xl leading-none" aria-hidden="true">{p.emoji}</span>
                  <span className={`text-[11px] font-semibold text-center leading-tight ${isActive ? 'text-white' : 'text-slate-600'}`}>
                {p.label}
              </span>
                </button>
            );
          })}
        </div>
      </section>
  );
}
