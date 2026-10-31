'use client';

/**
 * components/PWAInstallModal.tsx
 * ============================================================================
 * Modal de Instalación PWA para Teléfonos Móviles.
 *
 * Características:
 * - Detecta si el navegador soporta instalación directa (Android / Chromium).
 * - Para iPhone / iOS Safari, muestra instrucciones visuales amigables
 *   (Compartir -> Agregar a pantalla de inicio).
 * - Oculta la sugerencia si la aplicación ya se ejecuta en modo standalone.
 * ============================================================================
 */

import React from 'react';
import { Download, X, Smartphone, Share, PlusSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isIOS: boolean;
  onInstall: () => Promise<boolean>;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isIOS,
  onInstall,
}) => {
  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await onInstall();
    if (success) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#0B0F19] border border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Instalar Proyecta en tu Teléfono
                </h3>
                <p className="text-xs text-slate-400">
                  Experiencia nativa PWA a pantalla completa
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Beneficios */}
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
              <span>Ejecución del motor WebAssembly 100% offline y en segundo plano.</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <Download className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Sin descargas pesadas de tienda ni permisos invasivos.</span>
            </div>
          </div>

          {/* Opciones según dispositivo */}
          {isInstallable ? (
            <div className="space-y-3 pt-2">
              <button
                onClick={handleInstallClick}
                className="w-full h-12 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <Download className="w-4 h-4" />
                <span>Instalar Ahora en Pantalla de Inicio</span>
              </button>
            </div>
          ) : isIOS ? (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs text-slate-300">
              <div className="font-semibold text-white">Instrucciones para iPhone (Safari):</div>
              <ol className="space-y-2 list-decimal list-inside text-slate-300 leading-relaxed">
                <li>
                  Toca el botón <strong className="text-indigo-300">Compartir</strong> (
                  <Share className="w-3.5 h-3.5 inline text-indigo-400" />) en la barra inferior de Safari.
                </li>
                <li>
                  Baja en el menú y selecciona{' '}
                  <strong className="text-indigo-300">Agregar a inicio</strong> (
                  <PlusSquare className="w-3.5 h-3.5 inline text-indigo-400" />).
                </li>
                <li>Confirma tocando &quot;Agregar&quot; en la esquina superior derecha.</li>
              </ol>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 text-center space-y-1">
              <p>Puedes agregar esta app a tu pantalla de inicio desde el menú de tu navegador.</p>
              <p className="text-[11px] text-slate-500">Toca los 3 puntos (⋮) y selecciona &quot;Instalar aplicación&quot; o &quot;Agregar a la pantalla principal&quot;.</p>
            </div>
          )}

          <div className="text-center pt-1">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
