import { useState, useRef, useEffect } from 'react';

type Page = 'main' | 'cart';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  cartCount: number;
  isLoggedIn: boolean;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
  userName?: string;
  userEmail?: string;
}

function Avatar({ name }: { name: string }) {
  const initial = name.charAt(0);
  return (
    <span
      className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#2A7A4B] to-[#3D9960] text-white text-sm font-bold select-none shadow-sm shrink-0"
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

export default function Navbar({
  currentPage,
  onNavigate,
  cartCount,
  isLoggedIn,
  onLogin,
  onSignup,
  onLogout,
  userName = '사용자',
  userEmail = '',
}: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/92 backdrop-blur-md border-b border-[#D8E8DC]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-10 focus:px-3 focus:py-1.5 focus:bg-[#2A7A4B] focus:text-white focus:rounded-lg focus:text-sm"
      >
        본문 바로가기
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate('main')}
          className="flex items-center gap-2 group"
          aria-label="Nutripick 홈으로 이동"
        >
          <div
            className="w-9 h-9 bg-[#2A7A4B] rounded-xl flex items-center justify-center shadow-sm group-hover:bg-[#3D9960] transition-colors"
            aria-hidden="true"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C9 5 6 6.5 6 10c0 2.2 1.8 4 4 4s4-1.8 4-4c0-3.5-3-5-4-8z" fill="white" />
              <path
                d="M10 9 Q8.5 7.5 7.5 5.5"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1.3"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <span className="font-semibold text-[#17221B] text-[17px] tracking-tight">
            Nutri<span className="text-[#2A7A4B]">pick</span>
          </span>
        </button>

        {/* Right actions */}
        <nav className="flex items-center gap-1.5" aria-label="사용자 메뉴">
          {!isLoggedIn ? (
            /* ── 로그아웃 상태 ── */
            <>
              <button
                onClick={onLogin}
                className="hidden sm:inline-flex items-center px-3.5 py-1.5 text-sm text-[#566B5D] hover:text-[#2A7A4B] hover:bg-[#EAF4EE] transition-all rounded-lg font-medium"
              >
                로그인
              </button>
              <button
                onClick={onSignup}
                className="hidden sm:inline-flex items-center px-4 py-1.5 text-sm font-semibold text-white bg-[#2A7A4B] hover:bg-[#3D9960] transition-colors rounded-full shadow-sm"
              >
                회원가입
              </button>
              {/* Cart still accessible when logged out */}
              <button
                onClick={() => onNavigate('cart')}
                className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                  currentPage === 'cart'
                    ? 'text-[#2A7A4B] bg-[#EAF4EE]'
                    : 'text-[#566B5D] hover:text-[#2A7A4B] hover:bg-[#EAF4EE]'
                }`}
                aria-label={`장바구니 ${cartCount}개`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden="true">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#2A7A4B] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            </>
          ) : (
            /* ── 로그인 상태 ── */
            <>
              {/* Profile dropdown trigger */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl hover:bg-[#EAF4EE] transition-colors group"
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  aria-label="프로필 메뉴 열기"
                >
                  <Avatar name={userName} />
                  <span className="hidden sm:block text-sm font-medium text-[#17221B] group-hover:text-[#2A7A4B] transition-colors">
                    {userName}
                  </span>
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className={`hidden sm:block w-3.5 h-3.5 text-[#9DB3A3] transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  >
                    <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Dropdown panel */}
                {profileOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-[#D8E8DC] shadow-xl shadow-[#2A7A4B]/8 py-1.5 z-[200]"
                    role="menu"
                    aria-label="프로필 메뉴"
                  >
                    {/* User info */}
                    <div className="flex items-center gap-3 px-4 py-3">
                      <Avatar name={userName} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#17221B] truncate">{userName}</p>
                        {userEmail && (
                          <p className="text-[11px] text-[#9DB3A3] truncate">{userEmail}</p>
                        )}
                      </div>
                    </div>

                    <div className="mx-3 my-1 h-px bg-[#EEF5F0]" role="separator" />

                    {/* Menu items */}
                    <button
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#17221B] hover:bg-[#F4F8F5] hover:text-[#2A7A4B] transition-colors text-left"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 shrink-0" aria-hidden="true">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                      마이페이지
                    </button>
                    <button
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#17221B] hover:bg-[#F4F8F5] hover:text-[#2A7A4B] transition-colors text-left"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 shrink-0" aria-hidden="true">
                        <path d="M9 11H3m0 0 3-3m-3 3 3 3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 4h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9" />
                      </svg>
                      주문 내역
                    </button>

                    <div className="mx-3 my-1 h-px bg-[#EEF5F0]" role="separator" />

                    <button
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#566B5D] hover:bg-rose-50 hover:text-rose-600 transition-colors text-left"
                      role="menuitem"
                      onClick={() => {
                        setProfileOpen(false);
                        onLogout();
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 shrink-0" aria-hidden="true">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      로그아웃
                    </button>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-[#D8E8DC] mx-0.5" aria-hidden="true" />

              {/* Cart icon */}
              <button
                onClick={() => onNavigate('cart')}
                className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                  currentPage === 'cart'
                    ? 'text-[#2A7A4B] bg-[#EAF4EE]'
                    : 'text-[#566B5D] hover:text-[#2A7A4B] hover:bg-[#EAF4EE]'
                }`}
                aria-label={`장바구니 ${cartCount}개`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden="true">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#2A7A4B] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
