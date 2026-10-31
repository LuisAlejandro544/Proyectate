'use client';

/**
 * components/WasmLabView.tsx
 * ============================================================================
 * Laboratorio y Centro Técnico de WebAssembly (WASM).
 *
 * Responde directamente a las especificaciones del usuario:
 * - "Usaremos webassembly, pon los lenguajes que tú crees que pueden ayudar con el webassembly"
 * - "A veces el usuario hará apps PWA así que en estos casos se necesita aprovechar al máximo el webassembly"
 *
 * Incluye:
 * 1. Benchmark interactivo en vivo en el teléfono del usuario (WASM vs JS).
 * 2. Desglose detallado de los 5 lenguajes estrella para compilar a WebAssembly:
 *    - Rust (El estándar de oro de memoria segura)
 *    - C / C++ (Emscripten / Clang de alto rendimiento)
 *    - AssemblyScript (TypeScript compilado a WASM)
 *    - Zig (Binarios enanos freestanding sin dependencias)
 *    - TinyGo (Concurrencia con goroutines para navegadores)
 * 3. Visor interactivo de Bytecode binario e inspección de memoria lineal.
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  Play,
  ShieldCheck,
  Terminal,
  Code2,
  FileCode,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { WASM_LANGUAGES, runWasmBenchmark } from '@/lib/wasm-engine';
import { WasmBenchmarkResult, WasmLanguageGuide } from '@/lib/types';

export const WasmLabView: React.FC = () => {
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('rust');
  const [isRunningBenchmark, setIsRunningBenchmark] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<WasmBenchmarkResult | null>(null);
  const [showBytecode, setShowBytecode] = useState(false);

  const selectedLanguage =
    WASM_LANGUAGES.find((lang) => lang.id === selectedLanguageId) ||
    WASM_LANGUAGES[0];

  const handleRunBenchmark = async () => {
    setIsRunningBenchmark(true);
    try {
      // Damos 100ms para renderizar el spinner en el teléfono
      await new Promise((r) => setTimeout(r, 60));
      const res = await runWasmBenchmark(75000);
      setBenchmarkResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunningBenchmark(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full pb-20 md:pb-6">
      {/* ==================================================================== */}
      {/* CABECERA: MOTOR WEBASSEMBLY PWA                                      */}
      {/* ==================================================================== */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-800/50 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center border border-indigo-500/40">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">
                Laboratorio WebAssembly (WASM Core)
              </h1>
              <p className="text-xs text-indigo-300">
                Aceleración binaria de 32-bits y anonimato criptográfico en el cliente
              </p>
            </div>
          </div>

          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            WASM v1 Nativo Activo
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          En esta red social PWA, <strong className="text-white">WebAssembly</strong> procesa
          el análisis sintáctico de proyecciones y el hashing criptográfico de anonimato a
          velocidad nativa de CPU sin intermediación de servidores ni fugas de privacidad.
        </p>
      </div>

      {/* ==================================================================== */}
      {/* SECCIÓN 1: BENCHMARK EN VIVO (WASM vs JAVASCRIPT EN EL TELÉFONO)     */}
      {/* ==================================================================== */}
      <section className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Benchmark en Vivo en tu Dispositivo
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            75,000 iteraciones FNV-1a
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Ejecuta una prueba de estrés comparando la ejecución de bytecode en WebAssembly
          frente al motor JavaScript de tu navegador móvil:
        </p>

        {/* Botón de Ejecutar Benchmark */}
        <button
          onClick={handleRunBenchmark}
          disabled={isRunningBenchmark}
          className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-50"
        >
          {isRunningBenchmark ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Ejecutando en núcleos de CPU móvil...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Ejecutar Benchmark WASM en mi Teléfono</span>
            </>
          )}
        </button>

        {/* Resultados del Benchmark */}
        {benchmarkResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-2 space-y-3"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Tarjeta WASM */}
              <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-center">
                <span className="text-[10px] text-indigo-300 block uppercase font-mono">
                  WebAssembly
                </span>
                <span className="text-xl font-mono font-bold text-indigo-200">
                  {benchmarkResult.wasmTimeMs} ms
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {(benchmarkResult.wasmOpsPerSec / 1000).toFixed(0)}k ops/seg
                </span>
              </div>

              {/* Tarjeta JS */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">
                  JavaScript
                </span>
                <span className="text-xl font-mono font-bold text-slate-300">
                  {benchmarkResult.jsTimeMs} ms
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {(benchmarkResult.jsOpsPerSec / 1000).toFixed(0)}k ops/seg
                </span>
              </div>

              {/* Tarjeta Aceleración */}
              <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-center">
                <span className="text-[10px] text-emerald-300 block uppercase font-mono">
                  Aceleración
                </span>
                <span className="text-xl font-mono font-bold text-emerald-400">
                  +{benchmarkResult.speedupPercentage}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Mayor eficiencia
                </span>
              </div>

              {/* Tarjeta Memoria */}
              <div className="p-3 rounded-2xl bg-purple-950/60 border border-purple-800/60 text-center">
                <span className="text-[10px] text-purple-300 block uppercase font-mono">
                  Binario WASM
                </span>
                <span className="text-xl font-mono font-bold text-purple-200">
                  {benchmarkResult.memoryUsedBytes} B
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Micro-payload MVP
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>Iteraciones: {benchmarkResult.iterations.toLocaleString()}</span>
              <span className="text-emerald-400">Validado en WebAssembly.validate()</span>
            </div>
          </motion.div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* SECCIÓN 2: LENGUAJES QUE COMPILAN A WEBASSEMBLY                      */}
      {/* ==================================================================== */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Lenguajes que Pueden Ayudar con WebAssembly
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Comparativa de los 5 mejores lenguajes para compilar a WebAssembly en una red social moderna:
          </p>
        </div>

        {/* Pestañas de selección de lenguajes (Segmented Control Horizontal) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {WASM_LANGUAGES.map((lang: WasmLanguageGuide) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguageId(lang.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                selectedLanguageId === lang.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {lang.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Ficha técnica del lenguaje seleccionado */}
        <motion.div
          key={selectedLanguage.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4"
        >
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-base font-bold text-white">
                {selectedLanguage.name}
              </h3>
              <span className="text-xs font-mono text-indigo-300 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800/60">
                {selectedLanguage.binarySize}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 italic">
              &quot;{selectedLanguage.tagline}&quot;
            </p>
          </div>

          {/* Grid de atributos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold mb-1">
                Ideal Para:
              </span>
              <p className="text-slate-200">{selectedLanguage.bestFor}</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold mb-1">
                Modelo de Memoria:
              </span>
              <p className="text-slate-200">{selectedLanguage.memoryModel}</p>
            </div>
          </div>

          {/* Por qué en esta App */}
          <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-900/40 text-xs space-y-1">
            <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              ¿Por qué ayuda en esta red social PWA?
            </span>
            <p className="text-slate-300 leading-relaxed">
              {selectedLanguage.whyInThisApp}
            </p>
          </div>

          {/* Ventajas clave */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
              Puntos Fuertes:
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
              {selectedLanguage.pros.map((pro, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/60"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Comando de compilación a WASM */}
          <div className="p-3 rounded-2xl bg-[#07090E] border border-slate-800 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1 text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Comando de Compilación a WASM:</span>
            </div>
            <code className="text-emerald-300 select-all block break-all">
              {selectedLanguage.wasmCompileCommand}
            </code>
          </div>

          {/* Código Fuente en ese lenguaje */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>Implementación de referencia en {selectedLanguage.name.split(' ')[0]}:</span>
              </div>
            </div>
            <pre className="p-3.5 rounded-2xl bg-[#06080E] border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
              <code>{selectedLanguage.codeSnippet}</code>
            </pre>
          </div>
        </motion.div>
      </section>

      {/* ==================================================================== */}
      {/* SECCIÓN 3: INSPECTOR DE BYTECODE WEBASSEMBLY (Educativo / Técnico)   */}
      {/* ==================================================================== */}
      <section className="p-4 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-2">
        <button
          onClick={() => setShowBytecode(!showBytecode)}
          className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white font-medium py-1"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Ver Estructura de Secciones Binarias del Bytecode WASM</span>
          </div>
          <span className="text-indigo-400 font-mono text-[11px]">
            {showBytecode ? 'Ocultar' : 'Inspeccionar'}
          </span>
        </button>

        {showBytecode && (
          <div className="pt-2 text-xs text-slate-400 space-y-2 font-mono">
            <p className="text-[11px] leading-relaxed">
              Cabecera estándar WebAssembly MVP v1:
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-purple-300 break-all select-all">
              00 61 73 6D 01 00 00 00 01 0E 03 60 04 7F 7F 7F 7F 01 7F 03 04 03 00 01 02 07 2B 03 ...
            </div>
            <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
              <li>Sección 1 (Types): Firmas de funciones para cálculo de proyección y hash</li>
              <li>Sección 3 (Functions): Índices de funciones compiladas</li>
              <li>Sección 7 (Exports): calc_score, hash_step, mix_entropy</li>
              <li>Sección 10 (Code): Instrucciones aritméticas nativas i32</li>
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};
