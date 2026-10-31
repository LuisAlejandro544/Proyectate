'use client';

/**
 * components/PostDetailModal.tsx
 * ============================================================================
 * Vista detallada de una Proyección individual (Hilo de respuestas anónimas).
 *
 * Características:
 * - Muestra la publicación original completa con sus métricas y diagnóstico.
 * - Lista de comentarios de otros usuarios anónimos.
 * - Formulario para responder anónimamente con certificación WebAssembly.
 * - Datos criptográficos de la proyección (Hash, algoritmo y anonimato).
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Send,
  MessageSquare,
  Sparkles,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AnonymousAlterEgo,
  AnonymousComment,
  Projection,
  ReactionType,
} from '@/lib/types';

interface PostDetailModalProps {
  projection: Projection | null;
  isOpen: boolean;
  onClose: () => void;
  onReact: (id: string, type: ReactionType) => void;
  onAddComment: (projectionId: string, comment: AnonymousComment) => void;
  currentEgo: AnonymousAlterEgo;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  projection,
  isOpen,
  onClose,
  onReact,
  onAddComment,
  currentEgo,
}) => {
  const [replyText, setReplyText] = useState('');

  if (!isOpen || !projection) return null;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newComment: AnonymousComment = {
      id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      projectionId: projection.id,
      authorAlias: currentEgo.name,
      authorTag: currentEgo.tag,
      avatarGradient: currentEgo.gradient,
      content: replyText.trim(),
      createdAt: 'ahora mismo',
      likes: 1,
      wasmCertified: true,
    };

    onAddComment(projection.id, newComment);
    setReplyText('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl rounded-t-3xl sm:rounded-3xl bg-[#0B0F18] border border-slate-800 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/60 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-200">
                Hilo de Proyección Anónima
              </span>
              <span className="text-xs text-indigo-400 font-mono">
                {projection.wasmHash}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cuerpo con scroll */}
          <div className="p-5 space-y-5 overflow-y-auto flex-1">
            {/* Post principal */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${projection.avatarGradient} flex items-center justify-center text-white font-bold text-lg shadow-md`}
                  >
                    {projection.authorAlias.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 text-base">
                      {projection.authorAlias}
                    </div>
                    <div className="text-xs text-slate-400">
                      {projection.authorTag} · {projection.createdAt}
                    </div>
                  </div>
                </div>

                <span className="text-xs font-semibold text-indigo-400 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/60">
                  {projection.categoryLabel}
                </span>
              </div>

              {/* Texto */}
              <p className="text-slate-100 text-lg leading-relaxed whitespace-pre-line font-normal">
                {projection.content}
              </p>

              {/* Panel de Nivel de Proyección WASM */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-950 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="font-semibold">Nivel de Proyección (WebAssembly):</span>
                  </div>
                  <span className="font-mono font-bold text-indigo-300 text-sm">
                    {projection.projectionLevel}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${projection.projectionLevel}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  />
                </div>

                <div className="text-xs text-slate-400 italic">
                  <span className="text-slate-300 font-medium">Diagnóstico: </span>
                  {projection.psychologicalDiagnosis}
                </div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Sello WASM Criptográfico: {projection.wasmHash}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Lock className="w-3 h-3" />
                    Zero-Knowledge Identity
                  </span>
                </div>
              </div>

              {/* Reacciones en el modal */}
              <div className="flex items-center justify-around py-2.5 px-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <button
                  onClick={() => onReact(projection.id, 'meProyecte')}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-indigo-300 py-1 px-2 rounded-lg"
                >
                  <span className="text-base">🪞</span>
                  <span className="font-mono">{projection.reactions.meProyecte}</span>
                </button>
                <button
                  onClick={() => onReact(projection.id, 'teProyectaste')}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-rose-300 py-1 px-2 rounded-lg"
                >
                  <span className="text-base">💀</span>
                  <span className="font-mono">{projection.reactions.teProyectaste}</span>
                </button>
                <button
                  onClick={() => onReact(projection.id, 'confirmo')}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-300 py-1 px-2 rounded-lg"
                >
                  <span className="text-base">🤝</span>
                  <span className="font-mono">{projection.reactions.confirmo}</span>
                </button>
                <button
                  onClick={() => onReact(projection.id, 'terapia')}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-300 py-1 px-2 rounded-lg"
                >
                  <span className="text-base">🛋️</span>
                  <span className="font-mono">{projection.reactions.terapia}</span>
                </button>
              </div>
            </div>

            {/* Sección de Respuestas / Comentarios Anónimos */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>
                  Respuestas Anónimas ({(projection.comments?.length ?? 0)})
                </span>
              </div>

              {/* Lista de comentarios */}
              {(!projection.comments || projection.comments.length === 0) ? (
                <div className="p-6 text-center rounded-2xl bg-slate-950/50 border border-slate-900 text-slate-400 text-sm">
                  Nadie ha respondido a este desahogo aún. Sé el primer alter ego en comentar.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {projection.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${comment.avatarGradient} flex items-center justify-center text-xs text-white font-bold`}
                          >
                            {comment.authorAlias.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-200">
                              {comment.authorAlias}
                            </span>
                            <span className="text-[11px] text-slate-400 ml-1.5">
                              {comment.createdAt}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] text-emerald-400 font-mono">
                          ✓ WASM
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm pl-9">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Formulario para comentar anónimamente */}
          <div className="p-3.5 border-t border-slate-800 bg-[#0C1019] sticky bottom-0">
            <form onSubmit={handleSendComment} className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${currentEgo.gradient} flex items-center justify-center text-xs font-bold text-white shrink-0`}
                title={`Respondiendo como ${currentEgo.name}`}
              >
                {currentEgo.name.charAt(0)}
              </div>
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Comentar como ${currentEgo.name}...`}
                className="flex-1 h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Responder</span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
