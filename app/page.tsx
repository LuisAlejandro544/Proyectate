'use client';

/**
 * app/page.tsx
 * ============================================================================
 * Página Principal y Orquestador de la Red Social "Proyecta".
 *
 * Módulos integrados:
 * 1. Feed Principal ("Para Proyectarse"): con filtros virales, últimas y nivel delulu.
 * 2. Explorador de Tendencias: muro de hashtags de TikTok y ranking Deluluómetro.
 * 3. Laboratorio WebAssembly: benchmark en vivo en el teléfono e información de
 *    los 5 lenguajes (Rust, C++, AssemblyScript, Zig, TinyGo).
 * 4. Bóveda Anónima: gestión de máscaras (alter egos), estadísticas y privacidad.
 * 5. Modales: Crear Proyección (con análisis WASM en vivo), Hilo de respuestas, e instalación PWA.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  AnonymousAlterEgo,
  AnonymousComment,
  Projection,
  ReactionType,
} from '@/lib/types';
import {
  getActiveAlterEgo,
  getStoredProjections,
  INITIAL_ALTER_EGOS,
  INITIAL_PROJECTIONS,
  saveActiveAlterEgo,
  saveStoredProjections,
} from '@/lib/initial-data';
import { Navigation, ActiveTab } from '@/components/Navigation';
import { FeedView, FeedSort } from '@/components/FeedView';
import { ExploreView } from '@/components/ExploreView';
import { WasmLabView } from '@/components/WasmLabView';
import { ProfileVaultView } from '@/components/ProfileVaultView';
import { CreateProjectionModal } from '@/components/CreateProjectionModal';
import { PostDetailModal } from '@/components/PostDetailModal';
import { PWAInstallModal } from '@/components/PWAInstallModal';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function HomePage() {
  // Estado de navegación
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [feedSort, setFeedSort] = useState<FeedSort>('viral');

  // Datos principales inicializados directamente de LocalStorage
  const [projections, setProjections] = useState<Projection[]>(() => {
    return getStoredProjections();
  });
  const [activeEgo, setActiveEgo] = useState<AnonymousAlterEgo>(() => {
    return getActiveAlterEgo();
  });

  // Modales
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProjectionForDetail, setSelectedProjectionForDetail] = useState<Projection | null>(null);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  // Soporte PWA móvil
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isPwaInstallable, setIsPwaInstallable] = useState(false);
  const [isIOS] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua) && !isStandalone;
  });

  // Detección de instalación PWA en el navegador móvil
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setIsPwaInstallable(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstall);
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }
  }, []);

  // Función para instalar PWA
  const handleInstallPwa = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsPwaInstallable(false);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  // Reacciones interactivas a una proyección
  const handleReact = (id: string, type: ReactionType) => {
    setProjections((prev) => {
      const updated = prev.map((proj) => {
        if (proj.id !== id) return proj;

        const currentReactions = { ...proj.reactions };
        const userReactions = { ...(proj.userReactions || {}) };
        const hasReacted = !!userReactions[type];

        if (hasReacted) {
          // Desmarcar
          currentReactions[type] = Math.max(0, currentReactions[type] - 1);
          delete userReactions[type];
        } else {
          // Marcar
          currentReactions[type] = (currentReactions[type] || 0) + 1;
          userReactions[type] = true;
        }

        const newProj = {
          ...proj,
          reactions: currentReactions,
          userReactions,
        };

        // Si es la proyección abierta en el modal de detalle, actualizarla también
        if (selectedProjectionForDetail && selectedProjectionForDetail.id === id) {
          setSelectedProjectionForDetail(newProj);
        }

        return newProj;
      });

      saveStoredProjections(updated);
      return updated;
    });
  };

  // Publicar nueva proyección anónima con análisis WASM
  const handlePublish = (newProjection: Projection) => {
    setProjections((prev) => {
      const updated = [newProjection, ...prev];
      saveStoredProjections(updated);
      return updated;
    });
    // Cambiar automáticamente al feed y ordenar por 'latest' para ver su publicación de inmediato
    setFeedSort('latest');
    setActiveTab('feed');
    setFilterTag(null);
  };

  // Agregar comentario anónimo en un hilo
  const handleAddComment = (projectionId: string, comment: AnonymousComment) => {
    setProjections((prev) => {
      const updated = prev.map((proj) => {
        if (proj.id !== projectionId) return proj;

        const existingComments = proj.comments || [];
        const newComments = [...existingComments, comment];

        const updatedProj = {
          ...proj,
          comments: newComments,
          replyCount: newComments.length,
        };

        if (selectedProjectionForDetail && selectedProjectionForDetail.id === projectionId) {
          setSelectedProjectionForDetail(updatedProj);
        }

        return updatedProj;
      });

      saveStoredProjections(updated);
      return updated;
    });
  };

  // Selección de alter ego
  const handleSelectEgo = (ego: AnonymousAlterEgo) => {
    setActiveEgo(ego);
    saveActiveAlterEgo(ego);
  };

  // Eliminar proyección creada por el usuario
  const handleDeleteProjection = (id: string) => {
    setProjections((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveStoredProjections(updated);
      return updated;
    });
  };

  // Purga criptográfica total (reset)
  const handleResetAllData = () => {
    setProjections(INITIAL_PROJECTIONS);
    saveStoredProjections(INITIAL_PROJECTIONS);
    setActiveEgo(INITIAL_ALTER_EGOS[0]);
    saveActiveAlterEgo(INITIAL_ALTER_EGOS[0]);
    setFilterTag(null);
  };

  // Filtro por hashtag desde tarjetas o explorador
  const handleSelectTag = (tag: string) => {
    setFilterTag(tag);
    setActiveTab('feed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  // Filtrar proyecciones que pertenecen al alter ego activo para la bóveda
  const userProjections = projections.filter(
    (p) => p.authorAlias === activeEgo.name || (p.id.startsWith('proj-') && p.userReactions?.meProyecte)
  );

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 flex flex-col md:flex-row justify-center">
      {/* Navegación Modular (Sidebar en Desktop + Bottom Bar en Teléfono) */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openCreateModal={() => setIsCreateOpen(true)}
        activeEgo={activeEgo}
        isPwaInstallable={isPwaInstallable || isIOS}
        onInstallPwa={() => setIsPwaModalOpen(true)}
      />

      {/* Contenedor Principal de Contenido de la Pantalla Activa */}
      <main className="flex-1 max-w-2xl px-3.5 pt-3 md:px-6 md:pt-5 w-full min-h-screen">
        {activeTab === 'feed' && (
          <FeedView
            projections={projections}
            onReact={handleReact}
            onOpenThread={(p) => setSelectedProjectionForDetail(p)}
            onOpenCreate={() => setIsCreateOpen(true)}
            activeFilterTag={filterTag}
            onClearFilterTag={() => setFilterTag(null)}
            onSelectTag={handleSelectTag}
            currentSort={feedSort}
            onSortChange={setFeedSort}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreView
            projections={projections}
            onSelectTag={handleSelectTag}
            onOpenThread={(p) => setSelectedProjectionForDetail(p)}
          />
        )}

        {activeTab === 'wasmlab' && <WasmLabView />}

        {activeTab === 'vault' && (
          <ProfileVaultView
            activeEgo={activeEgo}
            onSelectEgo={handleSelectEgo}
            userProjections={userProjections}
            onDeleteProjection={handleDeleteProjection}
            onResetAllData={handleResetAllData}
            onOpenThread={(p) => setSelectedProjectionForDetail(p)}
          />
        )}
      </main>

      {/* ==================================================================== */}
      {/* MODALES DEL SISTEMA                                                  */}
      {/* ==================================================================== */}

      {/* Modal 1: Compositor de Proyección con Análisis WASM en Vivo */}
      <CreateProjectionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPublish={handlePublish}
        defaultEgo={activeEgo}
      />

      {/* Modal 2: Vista Detalle e Hilo de Respuestas Anónimas */}
      <PostDetailModal
        projection={selectedProjectionForDetail}
        isOpen={!!selectedProjectionForDetail}
        onClose={() => setSelectedProjectionForDetail(null)}
        onReact={handleReact}
        onAddComment={handleAddComment}
        currentEgo={activeEgo}
      />

      {/* Modal 3: Instalación PWA para Teléfonos Móviles */}
      <PWAInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
        isInstallable={isPwaInstallable}
        isIOS={isIOS}
        onInstall={handleInstallPwa}
      />
    </div>
  );
}
