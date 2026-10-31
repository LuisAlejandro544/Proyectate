'use client';

/**
 * components/Navigation.tsx
 * ============================================================================
 * Navegación modular para "Proyecta".
 *
 * Características clave:
 * 1. Barra de navegación inferior móvil táctil (Bottom Nav Bar) optimizada para
 *    uso con el pulgar en teléfonos (hitbox de al menos 44x44px).
 * 2. Navegación lateral responsiva en pantallas más anchas.
 * 3. Botón flotante central de acción rápida "+ Proyectar".
 * 4. Indicador de estado del motor WebAssembly.
 * 5. Acceso directo a instalación PWA para teléfonos móviles.
 * ============================================================================
 */

import React from 'react';
import {
  Flame,
  Search,
  Plus,
  Cpu,
  UserCheck,
  ShieldCheck,
  Sparkles,
  Download,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AnonymousAlterEgo } from '@/lib/types';

export type ActiveTab = 'feed' | 'explore' | 'wasmlab' | 'vault';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openCreateModal: () => void;
  activeEgo: AnonymousAlterEgo;
  isPwaInstallable: boolean;
  onInstallPwa: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  openCreateModal,
  activeEgo,
  isPwaInstallable,
  onInstallPwa,
}) => {
  return (
    <>
      {/* ==================================================================== */}
      {/* SIDEBAR NAVEGACIÓN DESKTOP / TABLET (Oculto en móvil)                */}
      {/* ==================================================================== */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 border-r border-slate-800/80 p-5 sticky top-0 h-screen bg-[#080B10]/95 backdrop-blur-md justify-between z-20">
        <div className="space-y-6">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-xl font-black text-white">P</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white">Proyecta</span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                  WASM
                </span>
              </div>
              <p className="text-xs text-slate-400">La red social anónima</p>
            </div>
          </div>

          {/* Links de Navegación */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('feed')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'feed'
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
              }`}
            >
              <Flame className={`w-5 h-5 ${activeTab === 'feed' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>Para Proyectarse</span>
            </button>

            <button
              onClick={() => setActiveTab('explore')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'explore'
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
              }`}
            >
              <Search className={`w-5 h-5 ${activeTab === 'explore' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>Tendencias & Delulu</span>
            </button>

            <button
              onClick={() => setActiveTab('wasmlab')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'wasmlab'
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
              }`}
            >
              <Cpu className={`w-5 h-5 ${activeTab === 'wasmlab' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <div className="text-left flex-1">
                <div className="flex items-center justify-between">
                  <span>Motor WebAssembly</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Rust/C++</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'vault'
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
              }`}
            >
              <UserCheck className={`w-5 h-5 ${activeTab === 'vault' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>Bóveda & Alter Egos</span>
            </button>
          </nav>

          {/* Botón Principal CTA: Proyectar */}
          <button
            onClick={openCreateModal}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/25"
          >
            <Sparkles className="w-4 h-4" />
            <span>Proyectarme Ahora</span>
          </button>
        </div>

        {/* Footer Sidebar: Alter Ego Activo & PWA */}
        <div className="space-y-3 pt-4 border-t border-slate-800/60">
          {isPwaInstallable && (
            <button
              onClick={onInstallPwa}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/30 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar App en Teléfono</span>
            </button>
          )}

          <div
            onClick={() => setActiveTab('vault')}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-850 transition-colors"
          >
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${activeEgo.gradient} flex items-center justify-center text-sm font-bold text-white shadow`}>
              {activeEgo.name.charAt(0)}
            </div>
            <div className="overflow-hidden flex-1 text-left">
              <div className="text-xs font-semibold text-slate-200 truncate">{activeEgo.name}</div>
              <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-400 shrink-0" />
                <span>{activeEgo.tag}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* BOTTOM NAV BAR TÁCTIL PARA TELÉFONO MÓVIL (Fixed, ergonómica)          */}
      {/* ==================================================================== */}
      <nav
        aria-label="Navegación móvil"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080B10]/95 backdrop-blur-xl border-t border-slate-800/80 pb-safe shadow-2xl"
      >
        <div className="grid grid-cols-5 items-center h-16 px-2 max-w-lg mx-auto">
          {/* Tab 1: Feed */}
          <button
            onClick={() => setActiveTab('feed')}
            className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Flame className={`w-5 h-5 transition-transform ${activeTab === 'feed' ? 'text-indigo-400 scale-110' : ''}`} />
            <span className={`text-[10px] mt-1 tracking-tight font-medium ${activeTab === 'feed' ? 'text-indigo-300 font-bold' : ''}`}>
              Feed
            </span>
          </button>

          {/* Tab 2: Explorar / Tendencias */}
          <button
            onClick={() => setActiveTab('explore')}
            className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Search className={`w-5 h-5 transition-transform ${activeTab === 'explore' ? 'text-indigo-400 scale-110' : ''}`} />
            <span className={`text-[10px] mt-1 tracking-tight font-medium ${activeTab === 'explore' ? 'text-indigo-300 font-bold' : ''}`}>
              Tendencias
            </span>
          </button>

          {/* Tab 3: Botón Central de Proyectarse (+ Acción) */}
          <div className="flex items-center justify-center">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={openCreateModal}
              aria-label="Crear nueva proyección anónima"
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 border-2 border-[#080B10]"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </motion.button>
          </div>

          {/* Tab 4: Motor WASM */}
          <button
            onClick={() => setActiveTab('wasmlab')}
            className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Cpu className={`w-5 h-5 transition-transform ${activeTab === 'wasmlab' ? 'text-indigo-400 scale-110' : ''}`} />
            <span className={`text-[10px] mt-1 tracking-tight font-medium ${activeTab === 'wasmlab' ? 'text-indigo-300 font-bold' : ''}`}>
              WASM
            </span>
          </button>

          {/* Tab 5: Mi Bóveda / Alter Egos */}
          <button
            onClick={() => setActiveTab('vault')}
            className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <div
              className={`w-6 h-6 rounded-md bg-gradient-to-tr ${activeEgo.gradient} flex items-center justify-center text-[10px] font-bold text-white border ${
                activeTab === 'vault' ? 'ring-2 ring-indigo-400 ring-offset-1 ring-offset-[#080B10]' : 'border-slate-700'
              }`}
            >
              {activeEgo.name.charAt(0)}
            </div>
            <span className={`text-[10px] mt-1 tracking-tight font-medium ${activeTab === 'vault' ? 'text-indigo-300 font-bold' : ''}`}>
              Bóveda
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
