'use client';

/**
 * components/FeedView.tsx
 * ============================================================================
 * Vista principal del Feed de Proyecciones.
 *
 * Muestra:
 * - Filtros rápidos: "Para Proyectarse (Viral)", "Últimas", "Nivel Delulu (+85%)".
 * - Explicación cultural de la tendencia de TikTok de "proyectarse".
 * - Lista de proyecciones con persistencia y reacciones en tiempo real.
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Flame,
  Clock,
  Sparkles,
  Filter,
  Plus,
  HelpCircle,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Projection, ReactionType } from '@/lib/types';
import { ProjectionCard } from './ProjectionCard';

interface FeedViewProps {
  projections: Projection[];
  onReact: (id: string, type: ReactionType) => void;
  onOpenThread: (projection: Projection) => void;
  onOpenCreate: () => void;
  activeFilterTag: string | null;
  onClearFilterTag: () => void;
  onSelectTag: (tag: string) => void;
  currentSort?: FeedSort;
  onSortChange?: (sort: FeedSort) => void;
}

export type FeedSort = 'viral' | 'latest' | 'delulu';

export const FeedView: React.FC<FeedViewProps> = ({
  projections,
  onReact,
  onOpenThread,
  onOpenCreate,
  activeFilterTag,
  onClearFilterTag,
  onSelectTag,
  currentSort,
  onSortChange,
}) => {
  const [internalSort, setInternalSort] = useState<FeedSort>('viral');
  const sort = currentSort ?? internalSort;
  const setSort = onSortChange ?? setInternalSort;
  const [showExplainer, setShowExplainer] = useState(false);

  // Filtrado y ordenamiento de proyecciones
  const filteredProjections = projections
    .filter((p) => {
      if (!activeFilterTag) return true;
      return (
        p.categoryLabel.toLowerCase() === activeFilterTag.toLowerCase() ||
        p.content.toLowerCase().includes(activeFilterTag.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sort === 'latest') {
        return b.createdTimestamp - a.createdTimestamp;
      }
      if (sort === 'delulu') {
        return b.projectionLevel - a.projectionLevel;
      }
      // 'viral' por defecto: suma total de reacciones
      const totalA = Object.values(a.reactions).reduce((sum, val) => sum + val, 0);
      const totalB = Object.values(b.reactions).reduce((sum, val) => sum + val, 0);
      return totalB - totalA;
    });

  return (
    <div className="space-y-4 max-w-2xl mx-auto w-full pb-20 md:pb-6">
      {/* ==================================================================== */}
      {/* HEADER PRINCIPAL DEL FEED & PESTAÑAS                                 */}
      {/* ==================================================================== */}
      <div className="sticky top-0 z-30 bg-[#080B10]/90 backdrop-blur-xl pt-2 pb-3 px-1 border-b border-slate-800/80">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-100 tracking-tight">
              Para Proyectarse
            </h1>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              WASM Core
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExplainer(!showExplainer)}
              title="¿Qué significa proyectarse en TikTok?"
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-800/40 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">¿Qué es Proyectarse?</span>
            </button>

            <button
              onClick={onOpenCreate}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Proyectarme</span>
            </button>
          </div>
        </div>

        {/* Explicación de la tendencia de TikTok (Desplegable) */}
        <AnimatePresence>
          {showExplainer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/70 to-slate-900 border border-indigo-800/50 mb-3 text-xs text-slate-300 space-y-1.5"
            >
              <div className="flex items-center justify-between font-semibold text-indigo-200">
                <span>¿De qué trata la tendencia de Proyectarse?</span>
                <button
                  onClick={() => setShowExplainer(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="leading-relaxed">
                En TikTok e internet, <strong className="text-white">“estar proyectada/o”</strong> o{' '}
                <strong className="text-white">“te proyectaste durísimo”</strong> ocurre cuando alguien comparte
                un desahogo, indirecta o crítica tan específica sobre otra persona que en realidad está exponiendo
                sus propias heridas, celos o autoengaño amoroso (<em>momento delulu</em>).
              </p>
              <p className="text-[11px] text-indigo-300 font-mono">
                Aquí lo haces 100% anónimo con un motor WebAssembly que mide tu nivel de proyección en vivo.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pestañas de Filtrado / Segmented Control */}
        <div className="flex items-center justify-between gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setSort('viral')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
              sort === 'viral'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Virales</span>
          </button>

          <button
            onClick={() => setSort('latest')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
              sort === 'latest'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Últimas</span>
          </button>

          <button
            onClick={() => setSort('delulu')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
              sort === 'delulu'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nivel Delulu (+85%)</span>
          </button>
        </div>

        {/* Tag filtrado si existe */}
        {activeFilterTag && (
          <div className="flex items-center justify-between mt-2 px-3 py-1.5 rounded-lg bg-indigo-950/70 border border-indigo-800/60 text-xs text-indigo-300">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3 h-3" />
              <span>Filtrando por: <strong>{activeFilterTag}</strong></span>
            </div>
            <button
              onClick={onClearFilterTag}
              className="text-xs text-indigo-400 hover:text-white underline font-medium"
            >
              Quitar filtro
            </button>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* LISTA DE PROYECCIONES ANÓNIMAS                                       */}
      {/* ==================================================================== */}
      {filteredProjections.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 text-indigo-400 mx-auto flex items-center justify-center border border-indigo-800/40">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-200 text-base">
            No hay proyecciones en este filtro
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Nadie se ha proyectado con este hashtag todavía. Sé el primer alter ego en publicar.
          </p>
          <button
            onClick={onOpenCreate}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md"
          >
            Crear Primera Proyección
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredProjections.map((projection) => (
            <motion.div
              key={projection.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ProjectionCard
                projection={projection}
                onReact={onReact}
                onOpenThread={onOpenThread}
                onTagClick={onSelectTag}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
