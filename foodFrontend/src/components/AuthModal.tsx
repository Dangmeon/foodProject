import { useState, useEffect, useRef, FormEvent } from 'react';

type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  mode: AuthMode;
  onClose: () => void;
  onLoginSuccess: (name: string) => void;
  onSwitchMode: (mode: AuthMode) => void;
}

function InputField({
  id, label, type = 'text', value, onChange, placeholder, required, autoComplete, icon, rightSlot,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#17221B] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9DB3A3]" aria-hidden="true">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="w-full h-11 pl-10 pr-10 rounded-xl border-2 border-[#D8E8DC] bg-white text-sm text-[#17221B] placeholder-[#B8C9BE] outline-none transition-all duration-150 focus:border-[#2A7A4B] focus:shadow-[0_0_0_3px_rgba(42,122,75,0.1)]"
        />
        {rightSlot && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</span>
        )}
      </div>
    </div>
  );
}

export default function AuthModal({ mode, onClose, onLoginSuccess, onSwitchMode }: AuthModalProps) {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    setPassword('');
    setConfirm('');
    setShowPwd(false);
    setTimeout(() => firstInputRef.current?.focus(), 50);
  }, [mode]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const displayName = mode === 'signup' ? (name || '사용자') : '김영희';
    onLoginSuccess(displayName);
  };

  const eyeIcon = (
    <button
      type="button"
      onClick={() => setShowPwd((v) => !v)}
      className="text-[#9DB3A3] hover:text-[#566B5D] transition-colors"
      aria-label={showPwd ? '비밀번호 숨기기' : '비밀번호 보기'}
    >
      {showPwd ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );

  const emailIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );

  const lockIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  const userIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[400] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'login' ? '로그인' : '회원가입'}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="modal-card relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#2A7A4B] via-[#3D9960] to-[#F5762E]" />

        <div className="px-8 pt-7 pb-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-[#9DB3A3] hover:text-[#566B5D] hover:bg-[#F4F8F5] transition-all"
            aria-label="닫기"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>

          {/* Logo + heading */}
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-[#2A7A4B] rounded-lg flex items-center justify-center shadow-sm">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C9 5 6 6.5 6 10c0 2.2 1.8 4 4 4s4-1.8 4-4c0-3.5-3-5-4-8z" fill="white" />
              </svg>
            </div>
            <span className="font-semibold text-[#17221B] text-base tracking-tight">
              Nutri<span className="text-[#2A7A4B]">pick</span>
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#17221B] mt-3 mb-1">
            {mode === 'login' ? '다시 만나서 반가워요 👋' : '함께 시작해봐요 🌱'}
          </h2>
          <p className="text-sm text-[#566B5D] mb-6">
            {mode === 'login'
              ? '이메일과 비밀번호로 로그인하세요.'
              : '무료로 가입하고 맞춤 영양 분석을 받아보세요.'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === 'signup' && (
              <>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label htmlFor="signup-name" className="block text-sm font-medium text-[#17221B] mb-1.5">이름</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9DB3A3]">{userIcon}</span>
                      <input
                        ref={firstInputRef as React.RefObject<HTMLInputElement>}
                        id="signup-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="홍길동"
                        autoComplete="name"
                        required
                        className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-[#D8E8DC] bg-white text-sm text-[#17221B] placeholder-[#B8C9BE] outline-none transition-all duration-150 focus:border-[#2A7A4B] focus:shadow-[0_0_0_3px_rgba(42,122,75,0.1)]"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label htmlFor="signup-nickname" className="block text-sm font-medium text-[#17221B] mb-1.5">닉네임</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9DB3A3]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <path d="M7 7l10 10M17 7 7 17" strokeLinecap="round" />
                          <circle cx="12" cy="12" r="9" />
                        </svg>
                      </span>
                      <input
                        id="signup-nickname"
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="나의닉네임"
                        autoComplete="nickname"
                        required
                        className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-[#D8E8DC] bg-white text-sm text-[#17221B] placeholder-[#B8C9BE] outline-none transition-all duration-150 focus:border-[#2A7A4B] focus:shadow-[0_0_0_3px_rgba(42,122,75,0.1)]"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-[#17221B] mb-1.5">이메일</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9DB3A3]">{emailIcon}</span>
                <input
                  ref={mode === 'login' ? (firstInputRef as React.RefObject<HTMLInputElement>) : undefined}
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@nutripick.kr"
                  autoComplete="email"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-[#D8E8DC] bg-white text-sm text-[#17221B] placeholder-[#B8C9BE] outline-none transition-all duration-150 focus:border-[#2A7A4B] focus:shadow-[0_0_0_3px_rgba(42,122,75,0.1)]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="auth-password" className="text-sm font-medium text-[#17221B]">비밀번호</label>
                {mode === 'login' && (
                  <button type="button" className="text-xs text-[#9DB3A3] hover:text-[#2A7A4B] transition-colors">
                    비밀번호를 잊으셨나요?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9DB3A3]">{lockIcon}</span>
                <input
                  id="auth-password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8자 이상 입력"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  className="w-full h-11 pl-10 pr-10 rounded-xl border-2 border-[#D8E8DC] bg-white text-sm text-[#17221B] placeholder-[#B8C9BE] outline-none transition-all duration-150 focus:border-[#2A7A4B] focus:shadow-[0_0_0_3px_rgba(42,122,75,0.1)]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">{eyeIcon}</span>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="signup-confirm" className="block text-sm font-medium text-[#17221B] mb-1.5">비밀번호 확인</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9DB3A3]">{lockIcon}</span>
                  <input
                    id="signup-confirm"
                    type={showPwd ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="비밀번호를 다시 입력"
                    autoComplete="new-password"
                    required
                    className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-[#D8E8DC] bg-white text-sm text-[#17221B] placeholder-[#B8C9BE] outline-none transition-all duration-150 focus:border-[#2A7A4B] focus:shadow-[0_0_0_3px_rgba(42,122,75,0.1)]"
                  />
                </div>
              </div>
            )}

            {/* Bottom checkboxes */}
            <div className="flex items-center justify-between pt-0.5">
              {mode === 'login' ? (
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#2A7A4B] cursor-pointer"
                  />
                  <span className="text-sm text-[#566B5D]">자동 로그인</span>
                </label>
              ) : (
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded accent-[#2A7A4B] cursor-pointer"
                  />
                  <span className="text-sm text-[#566B5D]">
                    <button type="button" className="text-[#2A7A4B] hover:underline font-medium">이용약관</button> 및{' '}
                    <button type="button" className="text-[#2A7A4B] hover:underline font-medium">개인정보처리방침</button>에 동의합니다
                  </span>
                </label>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-12 bg-[#2A7A4B] hover:bg-[#3D9960] active:scale-[0.98] text-white font-semibold rounded-xl shadow-sm transition-all duration-150 mt-1"
            >
              {mode === 'login' ? '로그인' : '회원가입'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#EEF5F0]" />
            <span className="text-xs text-[#9DB3A3] font-medium">또는 소셜 계정으로 계속</span>
            <div className="flex-1 h-px bg-[#EEF5F0]" />
          </div>

          {/* Social logins */}
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all hover:brightness-95 active:scale-[0.98]"
              style={{ background: '#FEE500', color: '#191919' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.73 1.69 5.13 4.27 6.57l-1.09 3.98 4.6-2.98c.72.1 1.46.15 2.22.15 5.523 0 10-3.477 10-7.8C22 6.477 17.523 3 12 3z" />
              </svg>
              카카오 로그인
            </button>
            <button
              type="button"
              className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl font-semibold text-sm text-white transition-all hover:brightness-110 active:scale-[0.98]"
              style={{ background: '#03C75A' }}
            >
              <span className="text-base font-black leading-none">N</span>
              네이버 로그인
            </button>
          </div>

          {/* Mode switch */}
          <p className="text-center text-sm text-[#566B5D] mt-6">
            {mode === 'login' ? (
              <>
                아직 계정이 없으신가요?{' '}
                <button
                  type="button"
                  onClick={() => onSwitchMode('signup')}
                  className="font-semibold text-[#2A7A4B] hover:underline"
                >
                  회원가입
                </button>
              </>
            ) : (
              <>
                이미 계정이 있으신가요?{' '}
                <button
                  type="button"
                  onClick={() => onSwitchMode('login')}
                  className="font-semibold text-[#2A7A4B] hover:underline"
                >
                  로그인
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
