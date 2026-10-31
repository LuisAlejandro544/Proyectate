'use client';

/**
 * components/ExploreView.tsx
 * ============================================================================
 * Pantalla de Explorar y Tendencias Virales de TikTok.
 *
 * Muestra:
 * - Buscador en vivo de desahogos y confesiones anónimas.
 * - Muro de hashtags virales de TikTok sobre proyectarse.
 * - El "Deluluómetro": ranking de las proyecciones más exageradas.
 * - Estadísticas globales de proyecciones anónimas certificadas por WASM.
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Search,
  TrendingUp,
  Sparkles,
  Flame,
  ShieldCheck,
  ChevronRight,
  HeartCrack,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Projection, TrendTopic } from '@/lib/types';
import { INITIAL_TRENDS } from '@/lib/initial-data';

interface ExploreViewProps {
  projections: Projection[];
  onSelectTag: (tag: string) => void;
  onOpenThread: (projection: Projection) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  projections,
  onSelectTag,
  onOpenThread,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Proyecciones filtradas por la búsqueda
  const searchResults = searchQuery.trim()
    ? projections.filter(
        (p) =>
          p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.authorAlias.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Top 3 proyecciones con mayor nivel de proyección
  const topDelulu = [...projections]
    .sort((a, b) => b.projectionLevel - a.projectionLevel)
    .slice(0, 3);

  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full pb-20 md:pb-6">
      {/* Buscador */}
      <div className="sticky top-0 z-20 bg-[#080B10]/90 backdrop-blur-xl pt-2 pb-3 border-b border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por indirectas, ex, terapia, #delulu..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Resultados de búsqueda si hay texto */}
      {searchQuery.trim() !== '' ? (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-300">
            Resultados para &quot;{searchQuery}&quot; ({searchResults.length})
          </h2>
          {searchResults.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
              No se encontraron proyecciones que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="space-y-2.5">
              {searchResults.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => onOpenThread(proj)}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="font-semibold text-slate-200">
                      {proj.authorAlias}
                    </span>
                    <span className="text-indigo-400 font-mono">
                      Nivel: {proj.projectionLevel}%
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 line-clamp-2">
                    {proj.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* ============================================================== */}
          {/* TENDENCIAS VIRALES DE TIKTOK                                    */}
          {/* ============================================================== */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-pink-400" />
                <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                  Tendencias Virales de Proyección
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                TikTok Trends
              </span>
            </div>

            <div className="grid gap-2.5">
              {INITIAL_TRENDS.map((trend: TrendTopic) => (
                <motion.div
                  key={trend.tag}
                  whileHover={{ x: 2 }}
                  onClick={() => onSelectTag(trend.tag)}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg shrink-0">
                      {trend.trendIcon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {trend.tag}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {trend.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                        {trend.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                      {trend.projectionsCount}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* EL DELULUÓMETRO: RANKING DE MAYOR PROYECCIÓN                   */}
          {/* ============================================================== */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                El Deluluómetro (Ranking WASM)
              </h2>
            </div>

            <div className="grid gap-3">
              {topDelulu.map((proj, idx) => (
                <div
                  key={proj.id}
                  onClick={() => onOpenThread(proj)}
                  className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/80 to-[#120F24]/80 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-slate-200">
                        {proj.authorAlias}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono font-bold text-rose-400">
                      <span>{proj.projectionLevel}%</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Nivel Delulu
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic line-clamp-2">
                    &quot;{proj.content}&quot;
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>{proj.categoryLabel}</span>
                    <span className="text-indigo-400 font-mono">
                      {proj.wasmHash}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Banner de Privacidad Criptográfica */}
          <section className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-900/40 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white block mb-0.5">
                Anonimato Criptográfico Total
              </span>
              Ningún post almacena dirección IP, correo ni cuenta. La identidad se
              enmascara mediante funciones hash ejecutadas directamente en WebAssembly
              en tu teléfono.
            </div>
          </section>
        </>
      )}
    </div>
  );
};
