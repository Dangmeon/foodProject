interface PurposeMenuProps {
  activePurpose: string | null;
  onSelect: (id: string) => void;
}

const purposes = [
  {
    id: 'fitness',
    emoji: '💪',
    label: '헬스/근성장',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    hoverBg: 'hover:bg-emerald-100',
    hoverBorder: 'hover:border-emerald-400',
    activeBg: 'bg-emerald-100',
    activeBorder: 'border-[#2A7A4B]',
    activeShadow: 'shadow-emerald-100',
    textColor: 'text-[#2A7A4B]',
  },
  {
    id: 'diet',
    emoji: '🥗',
    label: '다이어터',
    bg: 'bg-lime-50',
    border: 'border-lime-200',
    hoverBg: 'hover:bg-lime-100',
    hoverBorder: 'hover:border-lime-400',
    activeBg: 'bg-lime-100',
    activeBorder: 'border-lime-500',
    activeShadow: 'shadow-lime-100',
    textColor: 'text-lime-700',
  },
  {
    id: 'sugar',
    emoji: '🩸',
    label: '당 관리',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    hoverBg: 'hover:bg-rose-100',
    hoverBorder: 'hover:border-rose-400',
    activeBg: 'bg-rose-100',
    activeBorder: 'border-rose-400',
    activeShadow: 'shadow-rose-100',
    textColor: 'text-rose-600',
  },
  {
    id: 'clean',
    emoji: '🌱',
    label: '클린 식단',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    hoverBg: 'hover:bg-teal-100',
    hoverBorder: 'hover:border-teal-400',
    activeBg: 'bg-teal-100',
    activeBorder: 'border-teal-500',
    activeShadow: 'shadow-teal-100',
    textColor: 'text-teal-700',
  },
  {
    id: 'protein',
    emoji: '🥩',
    label: '단백질 보충',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    hoverBg: 'hover:bg-orange-100',
    hoverBorder: 'hover:border-orange-400',
    activeBg: 'bg-orange-100',
    activeBorder: 'border-[#F5762E]',
    activeShadow: 'shadow-orange-100',
    textColor: 'text-[#F5762E]',
  },
  {
    id: 'energy',
    emoji: '⚡',
    label: '에너지 충전',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    hoverBg: 'hover:bg-amber-100',
    hoverBorder: 'hover:border-amber-400',
    activeBg: 'bg-amber-100',
    activeBorder: 'border-amber-500',
    activeShadow: 'shadow-amber-100',
    textColor: 'text-amber-700',
  },
  {
    id: 'lowfat',
    emoji: '🫙',
    label: '저지방',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    hoverBg: 'hover:bg-sky-100',
    hoverBorder: 'hover:border-sky-400',
    activeBg: 'bg-sky-100',
    activeBorder: 'border-sky-500',
    activeShadow: 'shadow-sky-100',
    textColor: 'text-sky-600',
  },
  {
    id: 'vegan',
    emoji: '🌿',
    label: '비건',
    bg: 'bg-green-50',
    border: 'border-green-200',
    hoverBg: 'hover:bg-green-100',
    hoverBorder: 'hover:border-green-400',
    activeBg: 'bg-green-100',
    activeBorder: 'border-green-500',
    activeShadow: 'shadow-green-100',
    textColor: 'text-green-700',
  },
];

export default function PurposeMenu({ activePurpose, onSelect }: PurposeMenuProps) {
  return (
    <section
      className="max-w-7xl mx-auto px-10 pt-8 pb-2"
      aria-label="목적별 맞춤 식품"
    >
      {activePurpose && (
        <div className="flex justify-center mb-3">
          <button
            onClick={() => onSelect(activePurpose)}
            className="text-[11px] text-[#9DB3A3] hover:text-[#F5762E] transition-colors font-medium"
            aria-label="목적 선택 해제"
          >
            선택 해제
          </button>
        </div>
      )}

      <div>
        <div className="flex flex-wrap justify-center gap-3.5" role="list" aria-label="목적 카테고리">
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
                  'group relative flex flex-col items-center justify-between',
                  'w-[96px] aspect-square rounded-2xl border-2',
                  'pt-5 pb-3.5 px-2',
                  'transition-all duration-200 ease-out',
                  'active:scale-95',
                  isActive
                    ? [
                        p.activeBg,
                        p.activeBorder,
                        'shadow-lg',
                        p.activeShadow,
                        '-translate-y-0.5',
                      ].join(' ')
                    : [
                        p.bg,
                        p.border,
                        p.hoverBg,
                        p.hoverBorder,
                        'shadow-sm',
                        'hover:shadow-md',
                        'hover:-translate-y-0.5',
                      ].join(' '),
                ].join(' ')}
              >
                {/* Active indicator */}
                {isActive && (
                  <span
                    className="absolute top-2 right-2 w-2 h-2 rounded-full bg-current opacity-70"
                    style={{ color: 'currentColor' }}
                    aria-hidden="true"
                  />
                )}

                {/* Emoji */}
                <span
                  className="text-3xl leading-none transition-transform duration-200 group-hover:scale-110"
                  aria-hidden="true"
                >
                  {p.emoji}
                </span>

                {/* Label */}
                <span
                  className={`text-[11px] font-semibold text-center leading-tight transition-colors ${
                    isActive ? p.textColor : 'text-[#566B5D] group-hover:text-[#17221B]'
                  }`}
                >
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>

  );
}

