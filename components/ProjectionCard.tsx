'use client';

/**
 * components/ProjectionCard.tsx
 * ============================================================================
 * Tarjeta individual de Proyección anónima.
 *
 * Muestra:
 * - Alter Ego anónimo del autor y hash de anonimato WASM.
 * - Texto de la publicación con detección y estilo para hashtags (#TeProyectasteDurisimo, etc.)
 * - Medidor visual de "Nivel de Proyección Psicológica" calculado en WASM.
 * - Barra de reacciones virales ("Me proyecté 🪞", "Te proyectaste 💀", etc.)
 * - Respuestas anónimas y botón para abrir el hilo completo.
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  MessageSquare,
  Share2,
  Check,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Projection, ReactionType } from '@/lib/types';

interface ProjectionCardProps {
  projection: Projection;
  onReact: (id: string, type: ReactionType) => void;
  onOpenThread: (projection: Projection) => void;
  onTagClick?: (tag: string) => void;
}

export const ProjectionCard: React.FC<ProjectionCardProps> = ({
  projection,
  onReact,
  onOpenThread,
  onTagClick,
}) => {
  const [copied, setCopied] = useState(false);

  // Copia el texto anónimo al portapapeles
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(
        `"${projection.content}" — Proyectado anónimamente en Proyecta (Nivel: ${projection.projectionLevel}% | Hash: ${projection.wasmHash})`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback silencioso
    }
  };

  // Color de la barra de nivel de proyección
  const getLevelColor = (level: number) => {
    if (level >= 85) return 'from-pink-500 via-rose-500 to-purple-600';
    if (level >= 60) return 'from-violet-500 via-indigo-500 to-purple-500';
    return 'from-cyan-500 via-teal-500 to-indigo-500';
  };

  return (
    <article className="p-4 md:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all shadow-md relative overflow-hidden backdrop-blur-sm">
      {/* ================================================================== */}
      {/* CABECERA: ALTER EGO ANÓNIMO & FIRMA WEBASSEMBLY                    */}
      {/* ================================================================== */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar generativo */}
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${projection.avatarGradient} flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0`}
          >
            {projection.authorAlias.charAt(0)}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-sm text-slate-100">
                {projection.authorAlias}
              </span>
              <span className="text-xs text-slate-400">{projection.authorTag}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>{projection.createdAt}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-mono">
                <ShieldCheck className="w-3 h-3" />
                <span>{projection.wasmHash}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Badge de categoría / hashtag */}
        <button
          onClick={() => onTagClick?.(projection.categoryLabel)}
          className="text-xs font-medium text-indigo-300 hover:text-indigo-200 transition-colors shrink-0"
        >
          {projection.categoryLabel}
        </button>
      </div>

      {/* ================================================================== */}
      {/* CONTENIDO DE LA PROYECCIÓN                                         */}
      {/* ================================================================== */}
      <div
        onClick={() => onOpenThread(projection)}
        className="cursor-pointer group"
      >
        <p className="text-slate-200 text-[15px] leading-relaxed whitespace-pre-line mb-3 group-hover:text-white transition-colors">
          {projection.content}
        </p>

        {/* ================================================================ */}
        {/* MEDIDOR VISUAL DE PROYECCIÓN WEBASSEMBLY                          */}
        {/* ================================================================ */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Nivel de Proyección (WASM):</span>
            </div>
            <span className="font-mono font-bold text-indigo-300">
              {projection.projectionLevel}%
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${projection.projectionLevel}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${getLevelColor(projection.projectionLevel)}`}
            />
          </div>

          {/* Diagnóstico psicológico satírico */}
          <div className="text-[11px] text-slate-400 italic">
            <span className="text-slate-300 font-normal">Diagnóstico: </span>
            {projection.psychologicalDiagnosis}
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* BARRA DE REACCIONES TÁCTILES VIRALES (Ergonómicas en teléfono)     */}
      {/* ================================================================== */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/70 text-slate-400 gap-1 overflow-x-auto no-scrollbar">
        {/* Reacción 1: Me proyecté 🪞 */}
        <button
          onClick={() => onReact(projection.id, 'meProyecte')}
          title="100% soy yo / Me dolió"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium min-h-[40px] transition-all ${
            projection.userReactions?.meProyecte
              ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/60'
              : 'hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">🪞</span>
          <span className="font-mono text-[11px]">{projection.reactions.meProyecte}</span>
        </button>

        {/* Reacción 2: Te proyectaste 💀 */}
        <button
          onClick={() => onReact(projection.id, 'teProyectaste')}
          title="Te proyectaste durísimo"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium min-h-[40px] transition-all ${
            projection.userReactions?.teProyectaste
              ? 'bg-rose-950 text-rose-300 border border-rose-700/60'
              : 'hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">💀</span>
          <span className="font-mono text-[11px]">{projection.reactions.teProyectaste}</span>
        </button>

        {/* Reacción 3: Confirmo 🤝 */}
        <button
          onClick={() => onReact(projection.id, 'confirmo')}
          title="Confirmo palabra por palabra"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium min-h-[40px] transition-all ${
            projection.userReactions?.confirmo
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
              : 'hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">🤝</span>
          <span className="font-mono text-[11px]">{projection.reactions.confirmo}</span>
        </button>

        {/* Reacción 4: Terapia 🛋️ */}
        <button
          onClick={() => onReact(projection.id, 'terapia')}
          title="Terapia urgente"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium min-h-[40px] transition-all ${
            projection.userReactions?.terapia
              ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
              : 'hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">🛋️</span>
          <span className="font-mono text-[11px]">{projection.reactions.terapia}</span>
        </button>

        {/* Botón de comentarios / Hilo */}
        <button
          onClick={() => onOpenThread(projection)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-800 hover:text-slate-200 transition-colors min-h-[40px]"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px]">
            {projection.comments?.length || projection.replyCount || 0}
          </span>
        </button>

        {/* Compartir / Copiar */}
        <button
          onClick={handleShare}
          title="Copiar proyección anónima"
          className="flex items-center justify-center p-2 rounded-lg text-xs font-medium hover:bg-slate-800 hover:text-slate-200 transition-colors min-h-[40px] min-w-[40px]"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Share2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Enlace rápido al hilo si tiene comentarios */}
      {(projection.comments?.length ?? 0) > 0 && (
        <div
          onClick={() => onOpenThread(projection)}
          className="mt-3 pt-2.5 border-t border-slate-800/40 flex items-center justify-between text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors"
        >
          <span>
            Ver {projection.comments?.length} respuesta
            {(projection.comments?.length ?? 0) > 1 ? 's' : ''} anónima
            {(projection.comments?.length ?? 0) > 1 ? 's' : ''}...
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      )}
    </article>
  );
};
