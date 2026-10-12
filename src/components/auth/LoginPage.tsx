import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Radio,
  Share2,
  ArrowRight,
  Fingerprint,
  KeyRound,
  AlertCircle,
  Terminal,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const LoginPage: React.FC = () => {
  const { login } = useInvestigation();
  const [badgeId, setBadgeId] = useState('INV-8821-FCW');
  const [passcode, setPasscode] = useState('••••••••••••');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState('Standby');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAuthenticating(true);
    setAuthStep('Validating Hardware Enclave...');

    setTimeout(() => {
      setAuthStep('Decrypting Cryptographic Keys (FIPS-140)...');
    }, 300);

    setTimeout(() => {
      setAuthStep('Clearance Level 4 Confirmed. Access Granted.');
      setTimeout(() => {
        login();
      }, 250);
    }, 700);
  };

  const selectQuickProfile = (id: string) => {
    setBadgeId(id);
    handleLogin();
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#04091a] to-indigo-950/20 text-slate-100 font-sans select-none">
      {/* Background Cyber Grid FX */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(rgba(0, 242, 254, 0.15) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00f2fe]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-[#060e24]/95 backdrop-blur-2xl border border-[#172b57] hover:border-[#00f2fe]/50 rounded-2xl p-6 sm:p-8 shadow-2xl glow-neon-cyan relative z-10 transition-all space-y-6">
        {/* Emblem & Authority Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex relative mx-auto mb-1">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00f2fe]/20 via-blue-600/30 to-indigo-950 border border-[#00f2fe]/50 flex items-center justify-center shadow-lg shadow-[#00f2fe]/20">
              <Share2 className="w-8 h-8 text-[#00f2fe]" />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00f2fe] ring-4 ring-[#060e24] animate-ping" />
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#071333] border border-[#00f2fe]/40 text-[10px] font-bold text-[#00f2fe] font-mono tracking-widest uppercase">
              <Radio className="w-3 h-3 text-[#00f2fe] animate-pulse" />
              CENTRAL CRIME INTELLIGENCE COMMAND
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase font-mono mt-1">
              Criminal Network Analysis
            </h1>
            <p className="text-xs text-cyan-300 font-semibold tracking-wide">
              Restricted Forensic Enclave // Level 4 Clearance
            </p>
          </div>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1 font-mono">
              Officer Service ID / Badge ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                disabled={isAuthenticating}
                className="w-full bg-[#030612] border border-[#172b57] focus:border-[#00f2fe] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-[#00f2fe] transition-colors"
                placeholder="INV-XXXX-XXX"
                required
              />
              <UserCheck className="w-4 h-4 text-[#00f2fe] absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1 font-mono">
              Security Access Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                disabled={isAuthenticating}
                className="w-full bg-[#030612] border border-[#172b57] focus:border-[#00f2fe] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-[#00f2fe] transition-colors"
                placeholder="Passcode"
                required
              />
              <KeyRound className="w-4 h-4 text-[#00f2fe] absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Biometric Clearance Status */}
          <div className="p-3 rounded-xl bg-[#030612] border border-[#172b57] flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-300 font-medium font-mono text-[11px]">
              <Fingerprint className="w-4 h-4 text-[#00f2fe]" />
              <span>Biometric Hardware Enclave</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-mono">
              VERIFIED
            </span>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#00f2fe] via-cyan-400 to-blue-500 hover:from-[#00f2fe] hover:to-cyan-300 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#00f2fe]/20 hover:scale-[1.01] active:scale-[0.99] border border-[#00f2fe]/60 cursor-pointer disabled:opacity-80 font-mono"
          >
            {isAuthenticating ? (
              <>
                <Radio className="w-4 h-4 animate-spin text-slate-950" />
                <span>{authStep}</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-slate-950" />
                <span>Authenticate & Access Command Center</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </form>

        {/* Quick Officer Profiles */}
        <div className="pt-2 border-t border-[#142346] space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block flex items-center gap-1">
            <Terminal className="w-3 h-3 text-[#00f2fe]" /> Quick Clearance Roles:
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => selectQuickProfile('INV-ADHIKARI-FCW')}
              disabled={isAuthenticating}
              className="text-left px-3 py-1.5 rounded-lg bg-[#040817] hover:bg-[#071333] border border-[#172b57] hover:border-[#00f2fe]/40 text-xs text-slate-300 transition-colors flex items-center justify-between group"
            >
              <span className="font-medium text-[11px] group-hover:text-white">
                Insp. R. Adhikari (Financial Crimes Wing)
              </span>
              <span className="text-[10px] font-mono text-[#00f2fe]">Login →</span>
            </button>
            <button
              type="button"
              onClick={() => selectQuickProfile('ACP-DESHMUKH-TEL')}
              disabled={isAuthenticating}
              className="text-left px-3 py-1.5 rounded-lg bg-[#040817] hover:bg-[#071333] border border-[#172b57] hover:border-[#00f2fe]/40 text-xs text-slate-300 transition-colors flex items-center justify-between group"
            >
              <span className="font-medium text-[11px] group-hover:text-white">
                ACP V. Deshmukh (Telecom Intelligence)
              </span>
              <span className="text-[10px] font-mono text-[#00f2fe]">Login →</span>
            </button>
          </div>
        </div>

        {/* Security Caveat Notice */}
        <div className="p-2.5 rounded-lg bg-[#030612]/70 border border-[#172b57] text-[10px] text-slate-400 leading-tight flex items-start gap-1.5 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00f2fe] flex-shrink-0 mt-0.5" />
          <span>Restricted Law Enforcement Portal. Sessions are audit-logged with cryptographically signed certificates.</span>
        </div>
      </div>
    </div>
  );
};
