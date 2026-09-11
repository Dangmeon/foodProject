interface FilterSidebarProps {
  minProtein: number;
  onMinProteinChange: (v: number) => void;
  maxSugar: number;
  onMaxSugarChange: (v: number) => void;
  maxCalories: number;
  onMaxCaloriesChange: (v: number) => void;
  onReset: () => void;
}

interface SliderRowProps {
  id: string;
  label: string;
  direction: 'max' | 'min';
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  defaultVal: number;
  chipActiveBg: string;
  chipActiveText: string;
  accent: string;
}

function SliderRow({
  id, label, direction, value, onChange, min, max, step, unit, defaultVal, chipActiveBg, chipActiveText, accent,
}: SliderRowProps) {
  const isActive = direction === 'max' ? value < defaultVal : value > defaultVal;
  const fillPct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-start justify-between mb-2.5">
        <div>
          <p className="text-sm font-semibold text-[#17221B]">{label}</p>
          <p className="text-[11px] text-[#9DB3A3] mt-0.5">
            {direction === 'max' ? '이하로 제한' : '이상 섭취'}
          </p>
        </div>
        <span
          className={`shrink-0 text-[12px] font-bold px-2.5 py-1 rounded-full leading-none transition-colors ${
            isActive ? `${chipActiveBg} ${chipActiveText}` : 'bg-[#F4F8F5] text-[#566B5D]'
          }`}
        >
          {direction === 'min' ? '≥ ' : '≤ '}
          {value}
          {unit}
        </span>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{
          '--slider-accent': accent,
          background: `linear-gradient(to right, ${accent} ${fillPct}%, #D8E8DC ${fillPct}%)`,
        } as React.CSSProperties}
        aria-label={`${label} ${direction === 'max' ? '최대' : '최소'} ${value}${unit}`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />

      <div className="flex justify-between mt-1.5">
        <span className="text-[11px] text-[#9DB3A3]">{min}{unit}</span>
        <span className="text-[11px] text-[#9DB3A3]">{max}{unit}</span>
      </div>
    </div>
  );
}

interface QuickPresetProps {
  label: string;
  sublabel: string;
  checked: boolean;
  onToggle: () => void;
  dotColor: string;
  textActiveColor: string;
  checkBg: string;
  checkBorder: string;
}

function QuickPreset({ label, sublabel, checked, onToggle, textActiveColor, checkBg, checkBorder }: QuickPresetProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group select-none">
      <div
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${
          checked
            ? `${checkBg} ${checkBorder}`
            : 'border-[#D8E8DC] group-hover:border-[#2A7A4B]/40'
        }`}
        aria-hidden="true"
      >
        {checked && (
          <svg viewBox="0 0 12 12" fill="none" className={`w-2.5 h-2.5 ${textActiveColor}`}>
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <span className={`text-sm font-medium transition-colors ${checked ? textActiveColor : 'text-[#17221B]'}`}>
          {label}
        </span>
        <span className="text-[11px] text-[#9DB3A3] ml-1.5">{sublabel}</span>
      </div>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onToggle} aria-label={label} />
    </label>
  );
}

function FilterContent({
  minProtein, onMinProteinChange,
  maxSugar, onMaxSugarChange,
  maxCalories, onMaxCaloriesChange,
  onReset,
}: FilterSidebarProps) {
  const activeCount =
    (minProtein > 0 ? 1 : 0) +
    (maxSugar < 50 ? 1 : 0) +
    (maxCalories < 600 ? 1 : 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-[#17221B] text-sm flex items-center gap-1.5">
            <svg
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="w-4 h-4 text-[#2A7A4B]" aria-hidden="true"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
            영양 성분 조절기
          </h2>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold bg-[#2A7A4B] text-white w-4 h-4 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-[#566B5D] hover:text-[#F5762E] transition-colors font-medium flex items-center gap-1"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            초기화
          </button>
        )}
      </div>

      <div className="h-px bg-[#EEF5F0]" role="separator" />

      {/* Calorie slider */}
      <SliderRow
        id="calorie-range"
        label="칼로리"
        direction="max"
        value={maxCalories}
        onChange={onMaxCaloriesChange}
        min={0} max={600} step={10}
        unit="kcal"
        defaultVal={600}
        chipActiveBg="bg-[#FEF0E7]"
        chipActiveText="text-[#F5762E]"
        accent="#F5762E"
      />

      <div className="h-px bg-[#EEF5F0]" role="separator" />

      {/* Protein slider */}
      <SliderRow
        id="protein-range"
        label="단백질"
        direction="min"
        value={minProtein}
        onChange={onMinProteinChange}
        min={0} max={50} step={1}
        unit="g"
        defaultVal={0}
        chipActiveBg="bg-[#EAF4EE]"
        chipActiveText="text-[#2A7A4B]"
        accent="#2A7A4B"
      />

      <div className="h-px bg-[#EEF5F0]" role="separator" />

      {/* Sugar slider */}
      <SliderRow
        id="sugar-range"
        label="당류"
        direction="max"
        value={maxSugar}
        onChange={onMaxSugarChange}
        min={0} max={50} step={1}
        unit="g"
        defaultVal={50}
        chipActiveBg="bg-sky-50"
        chipActiveText="text-sky-600"
        accent="#0EA5E9"
      />

      <div className="h-px bg-[#EEF5F0]" role="separator" />

      {/* Quick preset checkboxes */}
      <div>
        <p className="text-[10px] font-bold text-[#566B5D] uppercase tracking-widest mb-3">
          빠른 설정
        </p>
        <div className="space-y-2.5">
          <QuickPreset
            label="고단백"
            sublabel="15g↑"
            checked={minProtein >= 15}
            onToggle={() => onMinProteinChange(minProtein >= 15 ? 0 : 15)}
            dotColor="bg-[#2A7A4B]"
            textActiveColor="text-[#2A7A4B]"
            checkBg="bg-[#EAF4EE]"
            checkBorder="border-[#2A7A4B]"
          />
          <QuickPreset
            label="저칼로리"
            sublabel="150kcal↓"
            checked={maxCalories <= 150}
            onToggle={() => onMaxCaloriesChange(maxCalories <= 150 ? 600 : 150)}
            dotColor="bg-[#F5762E]"
            textActiveColor="text-[#F5762E]"
            checkBg="bg-[#FEF0E7]"
            checkBorder="border-[#F5762E]"
          />
          <QuickPreset
            label="저당"
            sublabel="5g↓"
            checked={maxSugar <= 5}
            onToggle={() => onMaxSugarChange(maxSugar <= 5 ? 50 : 5)}
            dotColor="bg-sky-500"
            textActiveColor="text-sky-600"
            checkBg="bg-sky-50"
            checkBorder="border-sky-400"
          />
        </div>
      </div>
    </div>
  );
}

export default function FilterSidebar(props: FilterSidebarProps) {
  return (
    <aside
      className="w-64 shrink-0 sticky top-[76px] self-start max-h-[calc(100vh-88px)] overflow-y-auto"
      aria-label="영양 성분 조절기"
    >
      <div className="bg-white rounded-xl border border-[#D8E8DC] p-5 shadow-sm">
        <FilterContent {...props} />
      </div>
    </aside>
  );
}
