import React, { useState } from 'react';
import { AuthUser, UserRole, MadrasaSettings } from '../../types';
import { Lock, User, Shield, Check, LogIn, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: AuthUser, remember: boolean) => void;
  settings: MadrasaSettings;
  rememberedUser: { username: string; role: string } | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  settings,
  rememberedUser,
}) => {
  const [username, setUsername] = useState(rememberedUser?.username || 'admin');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState<UserRole>((rememberedUser?.role as UserRole) || 'admin');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRolePreset = (r: UserRole) => {
    setRole(r);
    if (r === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else if (r === 'teacher') {
      setUsername('teacher');
      setPassword('teacher123');
    } else {
      setUsername('viewer');
      setPassword('viewer123');
    }
    setErrorMsg('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('براہ کرم یوزر نیم درج کریں۔');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('براہ کرم پاس ورڈ درج کریں۔');
      return;
    }

    // Role-based auth verification for local prototype
    let displayName = 'ایڈمنسٹریٹر (سپر ایڈمن)';
    if (role === 'teacher') displayName = 'استاد محترم (Teacher)';
    if (role === 'viewer') displayName = 'مشاہدہ کار (Viewer Only)';

    const user: AuthUser = {
      id: `USR-${Date.now()}`,
      username: username.trim(),
      role,
      displayName,
    };

    onLogin(user, rememberMe);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Islamic Ambient Glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-amber-400/40 overflow-hidden relative z-10 p-8 sm:p-10">
        {/* Madrasa Official Crest */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-amber-400/80 p-2 shadow-lg flex items-center justify-center mb-3">
            <img
              src={settings.logoUrl}
              alt={settings.madrasaName}
              className="w-full h-full object-contain"
            />
          </div>

          <span className="text-xs font-bold text-amber-600 font-arabic tracking-wide">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
          <h1 className="text-xl font-black text-blue-950 font-nastaliq leading-relaxed mt-1">
            مدرسہ عربیہ مدینۃ العلوم
          </h1>
          <p className="text-xs text-slate-500 font-sans tracking-wide">
            {settings.madrasaName}
          </p>
          <div className="text-[11px] text-blue-900 font-bold bg-blue-50 border border-blue-200 px-3 py-0.5 rounded-full mt-2">
            نظامتِ دفتر و ایڈمن پورٹل
          </div>
        </div>

        {/* Role Quick Selector */}
        <div className="mb-6">
          <label className="block text-slate-700 font-bold text-xs mb-2 text-right">
            لاگ ان رول منتخب کریں:
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleRolePreset('admin')}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-blue-950 text-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ایڈمن (Admin)
            </button>
            <button
              type="button"
              onClick={() => handleRolePreset('teacher')}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                role === 'teacher'
                  ? 'bg-blue-950 text-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              استاد (Teacher)
            </button>
            <button
              type="button"
              onClick={() => handleRolePreset('viewer')}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                role === 'viewer'
                  ? 'bg-blue-950 text-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ناظر (Viewer)
            </button>
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold text-right">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs text-slate-800">
          <div>
            <label className="block font-bold text-slate-700 mb-1 text-right">یوزر نیم (Username)</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="یوزر نیم درج کریں..."
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 pr-10 text-slate-900 font-mono text-sm focus:ring-2 focus:ring-blue-950 focus:border-blue-950"
              />
              <User className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-right">پاس ورڈ (Password)</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="پاس ورڈ درج کریں..."
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 pr-10 text-slate-900 text-sm focus:ring-2 focus:ring-blue-950 focus:border-blue-950"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-blue-950 focus:ring-blue-900 border-slate-300 cursor-pointer"
              />
              <span>سیشن یاد رکھیں (Remember Session)</span>
            </label>

            <span className="text-[11px] text-amber-700 font-semibold">آف لائن سپورٹ فعال</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-950 to-blue-900 hover:from-blue-900 hover:to-blue-800 text-amber-400 font-bold text-sm rounded-xl shadow-lg shadow-blue-950/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 mt-2"
          >
            <LogIn className="w-4 h-4" />
            لاگ ان کریں (Sign In)
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
          <p>ڈیفالٹ لاگ ان: admin / admin123</p>
          <p className="mt-1">مدرسہ عربیہ مدینۃ العلوم © 2026</p>
        </div>
      </div>
    </div>
  );
};
