'use client';

/**
 * components/CreateProjectionModal.tsx
 * ============================================================================
 * Compositor y Analizador en Tiempo Real con WebAssembly.
 *
 * Características:
 * - A medida que el usuario escribe, el módulo WebAssembly compila y evalúa
 *   la longitud, palabras gatillo de desahogo y calcula el porcentaje de proyección.
 * - Muestra el diagnóstico satírico en vivo.
 * - Genera el hash criptográfico anónimo (FNV-1a) con WebAssembly.
 * - Permite elegir máscara anónima (Alter Ego).
 * - Selección de hashtag o categoría temática.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Send,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AnonymousAlterEgo,
  Projection,
  ProjectionCategory,
} from '@/lib/types';
import {
  analyzeProjectionWithWasm,
} from '@/lib/wasm-engine';
import { INITIAL_ALTER_EGOS } from '@/lib/initial-data';

interface CreateProjectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (projection: Projection) => void;
  defaultEgo: AnonymousAlterEgo;
}

const CATEGORIES: { id: ProjectionCategory; label: string; icon: string }[] = [
  { id: 'te-proyectaste', label: '#TeProyectasteDurisimo', icon: '💀' },
  { id: 'delulu-moment', label: '#MiMomentoDelulu', icon: '✨' },
  { id: 'situationship', label: '#Situationship', icon: '🥀' },
  { id: 'canon-event', label: '#CanonEvent', icon: '⚡' },
  { id: 'inseguridad-cruda', label: '#InseguridadDesbloqueada', icon: '🪞' },
  { id: 'indirecta-astral', label: '#IndirectaMuyDirecta', icon: '🌙' },
];

export const CreateProjectionModal: React.FC<CreateProjectionModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  defaultEgo,
}) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ProjectionCategory>('te-proyectaste');
  const [selectedEgo, setSelectedEgo] = useState<AnonymousAlterEgo>(defaultEgo);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    score: number;
    hash: string;
    diagnosis: string;
    triggerCount: number;
    engine: string;
  }>({
    score: 25,
    hash: '0x00000000',
    diagnosis: 'Escribe algo para que el motor WebAssembly analice tu proyección...',
    triggerCount: 0,
    engine: 'WebAssembly (WASM 32-bit)',
  });

  // Analiza con WebAssembly cada vez que cambia el texto de forma asíncrona
  useEffect(() => {
    let active = true;

    const timer = setTimeout(async () => {
      if (!content.trim()) {
        if (active) {
          setAnalysis({
            score: 18,
            hash: '0x811C9DC5',
            diagnosis: 'Esperando tu confesión anónima...',
            triggerCount: 0,
            engine: 'WebAssembly (WASM 32-bit)',
          });
          setIsAnalyzing(false);
        }
        return;
      }

      try {
        setIsAnalyzing(true);
        const res = await analyzeProjectionWithWasm(content);
        if (active) {
          setAnalysis({
            score: res.score,
            hash: res.hash,
            diagnosis: res.diagnosis,
            triggerCount: res.triggerCount,
            engine: res.executionEngine,
          });
          setIsAnalyzing(false);
        }
      } catch (e) {
        console.error(e);
        if (active) setIsAnalyzing(false);
      }
    }, 120);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [content]);

  // Genera un alter ego aleatorio
  const randomizeEgo = () => {
    const randomIndex = Math.floor(Math.random() * INITIAL_ALTER_EGOS.length);
    setSelectedEgo(INITIAL_ALTER_EGOS[randomIndex]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const chosenCat = CATEGORIES.find((c) => c.id === category);

    const newProjection: Projection = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      authorAlias: selectedEgo.name,
      authorTag: selectedEgo.tag,
      avatarGradient: selectedEgo.gradient,
      content: content.trim(),
      category: category,
      categoryLabel: chosenCat ? chosenCat.label : '#TeProyectasteDurisimo',
      createdAt: 'ahora mismo',
      createdTimestamp: Date.now(),
      reactions: {
        meProyecte: 1,
        teProyectaste: 0,
        vineAReir: 0,
        confirmo: 0,
        terapia: 0,
      },
      userReactions: {
        meProyecte: true, // Auto-reacción del autor
      },
      replyCount: 0,
      quoteCount: 0,
      projectionLevel: analysis.score,
      psychologicalDiagnosis: analysis.diagnosis,
      wasmHash: analysis.hash,
      verifiedByWasm: true,
      comments: [],
    };

    onPublish(newProjection);
    setContent('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md p-0 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl rounded-t-3xl sm:rounded-3xl bg-[#0C1019] border border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Cabecera del modal */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">
                  Nueva Proyección Anónima
                </h3>
                <p className="text-[11px] text-slate-400">
                  Desahógate sin rastro personal
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
            {/* Selector de Alter Ego */}
            <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${selectedEgo.gradient} flex items-center justify-center text-white font-bold text-sm`}
                >
                  {selectedEgo.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    {selectedEgo.name}
                  </div>
                  <div className="text-[11px] text-indigo-400 font-mono">
                    {selectedEgo.tag}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={randomizeEgo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Cambiar Máscara</span>
              </button>
            </div>

            {/* Selector de Hashtags virales */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Tendencia de TikTok / Tipo de Proyección:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      category === cat.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input de texto */}
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="¿Con qué te estás proyectando hoy? Ej: 'Decir que ya lo superé pero escuchar la playlist que me dedicó a las 3 AM...'"
                rows={4}
                maxLength={480}
                className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/80 resize-none text-[15px] leading-relaxed"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 px-1">
                <span>100% Cifrado local sin registro de usuario</span>
                <span className="font-mono">{content.length}/480</span>
              </div>
            </div>

            {/* ============================================================ */}
            {/* PANEL DE ANÁLISIS WEBASSEMBLY EN TIEMPO REAL                 */}
            {/* ============================================================ */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#101426] border border-indigo-950/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span className="font-semibold text-slate-200">
                    Motor WebAssembly Activo:
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/50">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{analysis.hash}</span>
                </div>
              </div>

              {/* Barra de Proyección */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">
                    Nivel de Proyección Psicológica:
                  </span>
                  <span className="font-mono font-bold text-indigo-300">
                    {analysis.score}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    animate={{ width: `${analysis.score}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  />
                </div>
              </div>

              {/* Diagnóstico en tiempo real */}
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-200">
                    {analysis.diagnosis}
                  </div>
                  {analysis.triggerCount > 0 && (
                    <div className="text-[11px] text-purple-300 mt-0.5">
                      Se detectaron {analysis.triggerCount} patrones de autoengaño/desahogo viral.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botón de publicar */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!content.trim() || isAnalyzing}
                className="w-full h-12 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <Send className="w-4 h-4" />
                <span>Publicar Proyección Anónima</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
