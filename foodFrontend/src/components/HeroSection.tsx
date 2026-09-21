import { useState, useRef, useEffect } from 'react';
import { TRENDING_SEARCHES } from '@/type/mockFoods';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: (term: string) => void;
  recentSearches: string[];
  onRemoveRecentSearch: (term: string) => void;
  onClearRecentSearches: () => void;
}

export default function HeroSection({
                                      searchQuery,
                                      onSearchChange,
                                      onSearch,
                                      recentSearches,
                                      onRemoveRecentSearch,
                                      onClearRecentSearches,
                                    }: HeroSectionProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleTermClick = (term: string) => {
    onSearch(term);
    setDropdownOpen(false);
  };

  return (
      <section
          className="relative pt-16 pb-8 px-4 sm:px-6 lg:px-8"
          style={{
            background: 'linear-gradient(160deg, #F0F7F3 0%, #F5F7FA 50%, #F7F3FF 100%)',
          }}
          aria-labelledby="hero-heading"
      >
        {/* Subtle background accents */}
        <div
            className="absolute top-0 right-0 w-[400px] h-[200px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.05) 0%, transparent 70%)' }}
            aria-hidden="true"
        />

        <div className="relative max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-semibold mb-4 shadow-sm">
            <svg viewBox="0 0 16 16" fill="none" stroke="#2A7A4B" strokeWidth="1.5" className="w-3.5 h-3.5" aria-hidden="true">
              <path d="M8 2v4l2.5 1.5" />
              <circle cx="8" cy="8" r="6.5" />
            </svg>
            영양 정보 기반 식품 비교 도구
          </div>

          {/* Headline — compact */}
          <h1
              id="hero-heading"
              className="text-2xl sm:text-3xl lg:text-4xl leading-[1.25] text-slate-900 mb-3"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", wordBreak: 'keep-all' }}
          >
            제품을 고르기 전에{' '}
            <span
                style={{
                  background: 'linear-gradient(135deg, #2A7A4B 30%, #3D9960)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
            >
            영양 성분
          </span>
            을 먼저 비교하세요
          </h1>

          <p className="text-slate-500 text-sm mb-7 leading-relaxed">
            칼로리·단백질·당류·나트륨을 한눈에 — 2~3개 제품을 선택해 나란히 비교할 수 있어요.
          </p>

          {/* Search bar with dropdown */}
          <div ref={containerRef} className="relative max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div
                  className={`flex items-center gap-3 h-14 px-5 bg-white rounded-2xl border-2 shadow-lg transition-all duration-200 ${
                      dropdownOpen
                          ? 'border-[#2A7A4B] shadow-[#2A7A4B]/15 rounded-b-none border-b-transparent shadow-none'
                          : 'border-[#D8E8DC] hover:border-[#2A7A4B]/40'
                  }`}
              >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5 text-[#566B5D] shrink-0"
                    aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>

                <input
                    ref={inputRef}
                    type="text"
                    placeholder="제품명, 브랜드명으로 검색하세요..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={() => setDropdownOpen(true)}
                    className="flex-1 text-base text-[#17221B] placeholder-[#9DB3A3] bg-transparent outline-none"
                    aria-label="식품 검색"
                    aria-autocomplete="list"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="listbox"
                />

                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => {
                          onSearchChange('');
                          inputRef.current?.focus();
                        }}
                        className="text-[#9DB3A3] hover:text-[#566B5D] transition-colors shrink-0"
                        aria-label="검색어 지우기"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                )}

                <button
                    type="submit"
                    className="shrink-0 h-9 px-5 bg-[#2A7A4B] hover:bg-[#3D9960] text-white rounded-xl text-sm font-semibold transition-colors active:scale-95"
                >
                  검색
                </button>
              </div>
            </form>

            {/* Dropdown */}
            {dropdownOpen && (
                <div
                    className="absolute left-0 right-0 top-full bg-white border-2 border-[#2A7A4B] border-t-[#D8E8DC] rounded-b-2xl shadow-2xl shadow-[#2A7A4B]/12 z-[100]"
                    role="listbox"
                    aria-label="검색 추천"
                >
                  {/* Recent searches */}
                  {recentSearches.length > 0 && (
                      <div className="px-4 pt-3 pb-2">
                        <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#566B5D] uppercase tracking-widest">
                      최근 검색어
                    </span>
                          <button
                              type="button"
                              onClick={onClearRecentSearches}
                              className="text-[11px] text-[#9DB3A3] hover:text-[#F5762E] transition-colors"
                          >
                            전체 삭제
                          </button>
                        </div>
                        <ul className="space-y-0.5">
                          {recentSearches.map((term) => (
                              <li key={term} className="flex items-center gap-2 group">
                                <button
                                    type="button"
                                    onClick={() => handleTermClick(term)}
                                    className="flex-1 flex items-center gap-2.5 py-1.5 px-2 rounded-lg text-sm text-[#17221B] hover:bg-slate-50 text-left transition-colors"
                                    role="option"
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-[#9DB3A3] shrink-0" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v4l2 2" />
                                  </svg>
                                  {term}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onRemoveRecentSearch(term)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-[#9DB3A3] hover:text-[#566B5D] transition-all"
                                    aria-label={`최근 검색어 '${term}' 삭제`}
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                  </svg>
                                </button>
                              </li>
                          ))}
                        </ul>
                      </div>
                  )}

                  {recentSearches.length > 0 && (
                      <div className="mx-4 h-px bg-[#EEF5F0]" role="separator" />
                  )}

                  {/* Trending */}
                  <div className="px-4 pt-3 pb-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-[#F5762E]" aria-hidden="true">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                      </svg>
                      <span className="text-[10px] font-bold text-[#566B5D] uppercase tracking-widest">
                    실시간 인기 검색어
                  </span>
                    </div>
                    <ul className="space-y-0.5">
                      {TRENDING_SEARCHES.map((term, idx) => (
                          <li key={term}>
                            <button
                                type="button"
                                onClick={() => handleTermClick(term)}
                                className="w-full flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors text-left"
                                role="option"
                            >
                        <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{
                              background: idx === 0 ? '#F5762E' : idx <= 2 ? '#2A7A4B' : '#EAF4EE',
                              color: idx <= 2 ? 'white' : '#566B5D',
                            }}
                            aria-hidden="true"
                        >
                          {idx + 1}
                        </span>
                              <span className="text-sm text-[#17221B]">{term}</span>
                              {idx === 0 && (
                                  <span className="ml-auto text-[10px] font-semibold text-[#F5762E] bg-[#FEF0E7] px-1.5 py-0.5 rounded-full">HOT</span>
                              )}
                            </button>
                          </li>
                      ))}
                    </ul>
                  </div>
                </div>
            )}
          </div>
        </div>
      </section>
  );
}
