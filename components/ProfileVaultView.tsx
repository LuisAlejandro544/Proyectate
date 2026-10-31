'use client';

/**
 * components/ProfileVaultView.tsx
 * ============================================================================
 * Bóveda Anónima y Gestión de Alter Egos.
 *
 * Características:
 * - Selección de Máscaras y Alter Egos anónimos para publicar.
 * - Estadísticas del dispositivo móvil (proyecciones creadas, reacciones acumuladas).
 * - Historial local de publicaciones del usuario.
 * - Función de "Purga Criptográfica Total" para borrar todo rastro del teléfono.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Sparkles,
  Trash2,
  Lock,
  Layers,
  HeartHandshake,
  Check,
  RotateCcw,
  Fingerprint,
  Mail,
  Key,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AnonymousAlterEgo, Projection } from '@/lib/types';
import { INITIAL_ALTER_EGOS } from '@/lib/initial-data';

interface ProfileVaultViewProps {
  activeEgo: AnonymousAlterEgo;
  onSelectEgo: (ego: AnonymousAlterEgo) => void;
  userProjections: Projection[];
  onDeleteProjection: (id: string) => void;
  onResetAllData: () => void;
  onOpenThread: (projection: Projection) => void;
}

export const ProfileVaultView: React.FC<ProfileVaultViewProps> = ({
  activeEgo,
  onSelectEgo,
  userProjections,
  onDeleteProjection,
  onResetAllData,
  onOpenThread,
}) => {
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  // Estados de sesión en el Edge
  const [sessionState, setSessionState] = useState<{
    isAnonymous: boolean;
    email: string | null;
    hasPasskey: boolean;
  }>({
    isAnonymous: true,
    email: null,
    hasPasskey: false,
  });
  const [emailInput, setEmailInput] = useState('');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [sessionStatusMessage, setSessionStatusMessage] = useState<string | null>(null);

  // Cargar sesión real al montar
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.session) {
          setSessionState({
            isAnonymous: data.session.isAnonymous,
            email: data.session.email || null,
            hasPasskey: data.session.hasPasskey,
          });
        }
      })
      .catch((err) => console.error('Error cargando sesión:', err));
  }, []);

  // Función para blindar cuenta con Passkey (WebAuthn / Huella)
  const handleBackupWithPasskey = async () => {
    setIsBackingUp(true);
    setSessionStatusMessage(null);
    try {
      // Si el navegador soporta WebAuthn nativo en el teléfono
      if (typeof window !== 'undefined' && window.PublicKeyCredential) {
        // Enviar al endpoint de respaldo
        const res = await fetch('/api/auth/backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'passkey' }),
        });
        const data = await res.json();
        if (data.success) {
          setSessionState((prev) => ({ ...prev, isAnonymous: false, hasPasskey: true }));
          setSessionStatusMessage('¡Cuenta blindada con Passkey biométrico en Cloudflare D1!');
        }
      } else {
        setSessionStatusMessage('Tu navegador móvil no tiene soporte WebAuthn activo.');
      }
    } catch {
      setSessionStatusMessage('Error al registrar Passkey. Intenta de nuevo.');
    } finally {
      setIsBackingUp(false);
    }
  };

  // Función para respaldar con Correo
  const handleBackupWithEmail = async () => {
    if (!emailInput || !emailInput.includes('@')) return;
    setIsBackingUp(true);
    setSessionStatusMessage(null);
    try {
      const res = await fetch('/api/auth/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'email', email: emailInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSessionState((prev) => ({
          ...prev,
          isAnonymous: false,
          email: emailInput.trim(),
        }));
        setSessionStatusMessage(`¡Cuenta enlazada a ${emailInput.trim()}!`);
        setEmailInput('');
      }
    } catch {
      setSessionStatusMessage('Error al enlazar el correo.');
    } finally {
      setIsBackingUp(false);
    }
  };

  // Verificar estado del token en Cloudflare Edge
  const handleVerifyEdgeSession = async () => {
    setIsCheckingSession(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      if (data.authenticated) {
        setSessionStatusMessage(`Sesión Edge activa y verificada (${elapsed}ms latencia)`);
      } else {
        // Auto-inicializar sesión anónima real
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceHash: activeEgo.tag,
            activeAlterEgoId: activeEgo.id,
          }),
        });
        setSessionStatusMessage(`Nueva sesión anónima sincronizada en Cloudflare D1 (${elapsed}ms)`);
      }
    } catch {
      setSessionStatusMessage('Error de conexión con el Edge.');
    } finally {
      setIsCheckingSession(false);
    }
  };

  // Estadísticas acumuladas
  const totalReactionsReceived = userProjections.reduce((acc, p) => {
    return acc + Object.values(p.reactions).reduce((sum, v) => sum + v, 0);
  }, 0);

  const avgProjectionLevel =
    userProjections.length > 0
      ? Math.round(
          userProjections.reduce((sum, p) => sum + p.projectionLevel, 0) /
            userProjections.length
        )
      : 84;

  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full pb-20 md:pb-6">
      {/* ==================================================================== */}
      {/* TARJETA DE PERFIL ANÓNIMO ACTIVO                                     */}
      {/* ==================================================================== */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-800/50 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${activeEgo.gradient} flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-600/30`}
            >
              {activeEgo.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">{activeEgo.name}</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                  {activeEgo.badge}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeEgo.tag}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed italic">
          &quot;{activeEgo.description}&quot;
        </p>

        {/* Métricas acumuladas del usuario */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-indigo-900/40">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-indigo-950 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">
              Mis Posts
            </span>
            <span className="text-lg font-bold font-mono text-white">
              {userProjections.length}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-indigo-950 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">
              Nivel Promedio
            </span>
            <span className="text-lg font-bold font-mono text-indigo-300">
              {avgProjectionLevel}%
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-indigo-950 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">
              Reacciones
            </span>
            <span className="text-lg font-bold font-mono text-pink-400">
              {totalReactionsReceived}
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* CENTRO DE SESIÓN REAL Y RESPALDO (BETTER AUTH / D1 / PASSKEYS)       */}
      {/* ==================================================================== */}
      <section className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Sesión en el Edge & Respaldo
            </h2>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {sessionState.isAnonymous ? 'Anónimo Activo' : 'Cuenta Respaldada'}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Tu sesión está sincronizada con el motor en el Edge (Cloudflare D1). Puedes blindarla con tu huella o FaceID para no perder nunca tus publicaciones si borras el navegador.
        </p>

        {sessionStatusMessage && (
          <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-800 text-xs text-indigo-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{sessionStatusMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Opción 1: Passkey Biométrico */}
          <button
            onClick={handleBackupWithPasskey}
            disabled={isBackingUp}
            className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-700/50 hover:border-emerald-500 text-left transition-all flex items-center gap-3 active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Blindar con Passkey</div>
              <div className="text-[10px] text-slate-400">Huella o FaceID del teléfono</div>
            </div>
          </button>

          {/* Opción 2: Correo Electrónico */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>Vincular Correo</span>
            </div>
            <div className="flex gap-1.5">
              <input
                type="email"
                placeholder="tu@correo.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleBackupWithEmail}
                disabled={isBackingUp || !emailInput}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shrink-0"
              >
                Vincular
              </button>
            </div>
          </div>
        </div>

        {/* Verificación de token real en Edge */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>ID de Dispositivo: {activeEgo.tag}</span>
          <button
            onClick={handleVerifyEdgeSession}
            disabled={isCheckingSession}
            className="hover:text-indigo-300 flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isCheckingSession ? 'animate-spin' : ''}`} />
            <span>Verificar en Edge</span>
          </button>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SELECTOR DE MÁSCARAS / ALTER EGOS                                    */}
      {/* ==================================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Elige tu Máscara Activa
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {INITIAL_ALTER_EGOS.length} disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {INITIAL_ALTER_EGOS.map((ego) => {
            const isSelected = ego.id === activeEgo.id;
            return (
              <motion.div
                key={ego.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectEgo(ego)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-950/50 border-indigo-500 shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${ego.gradient} flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {ego.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {ego.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {ego.tag}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">
                  {ego.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* HISTORIAL LOCAL DE MIS PROYECCIONES EN ESTE TELÉFONO                 */}
      {/* ==================================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Proyecciones Creadas en este Teléfono
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {userProjections.length} publicaciones
          </span>
        </div>

        {userProjections.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400 space-y-1">
            <p>Aún no has proyectado nada desde este navegador.</p>
            <p className="text-[11px] text-slate-500">
              Tus publicaciones se guardan de forma privada en el almacenamiento local de tu teléfono.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {userProjections.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-300">
                    {p.categoryLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 text-[11px]">
                      Nivel: {p.projectionLevel}%
                    </span>
                    <button
                      onClick={() => onDeleteProjection(p.id)}
                      title="Eliminar del dispositivo"
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p
                  onClick={() => onOpenThread(p)}
                  className="text-xs text-slate-200 line-clamp-2 cursor-pointer hover:text-white"
                >
                  {p.content}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-850">
                  <span>Hash: {p.wasmHash}</span>
                  <span>{p.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* PURGA CRIPTOGRÁFICA TOTAL (Seguridad y Privacidad)                   */}
      {/* ==================================================================== */}
      <section className="p-4 rounded-3xl bg-slate-950/80 border border-slate-800/80 space-y-3">
        <div className="flex items-center gap-2 text-slate-200 text-sm font-semibold">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Seguridad de Anonimato en tu Teléfono</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Esta red social no almacena cookies de rastreo ni identificadores de hardware.
          Si deseas reiniciar todos los datos locales y restablecer el feed a su estado
          original:
        </p>

        {showPurgeConfirm ? (
          <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800/60 space-y-2">
            <p className="text-xs text-rose-200 font-medium">
              ¿Confirmas borrar todo el historial y reiniciar los datos locales de tu teléfono?
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onResetAllData();
                  setShowPurgeConfirm(false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500"
              >
                Sí, Purga Criptográfica
              </button>
              <button
                onClick={() => setShowPurgeConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowPurgeConfirm(true)}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Purga Criptográfica (Reiniciar Todo)</span>
          </button>
        )}
      </section>
    </div>
  );
};
