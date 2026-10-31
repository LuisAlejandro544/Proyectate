# Roadmap — Proyecta Social

Este documento define la trayectoria evolutiva del proyecto **Proyecta**, estructurado en fases de entrega con objetivos claros, dependencias técnicas e impacto en la experiencia del usuario.

---

## 📌 Estado Actual del Proyecto

```
[████████████████████] Fase 1: Arquitectura Base, WASM en Rust y PWA (100% Completado)
[███████████████░░░░░] Fase 2: Configuración Nativa Cloudflare (D1, Turnstile, R2) (En Progreso)
[████████░░░░░░░░░░░░] Fase 3: Sesiones Anónimas y Passkeys Biométricas (Próximo)
[░░░░░░░░░░░░░░░░░░░░] Fase 4: Desahogos en Audio Cifrado (WASM) (Planeado)
[░░░░░░░░░░░░░░░░░░░░] Fase 5: Salas Efímeras de Catarsis Colectiva (Futuro)
```

---

## 🗺️ Fases de Desarrollo

### 🟢 Fase 1: Núcleo Fundamental y Experiencia Móvil (Completado)
* [x] **Arquitectura Next.js 15 App Router:** Estructura modular orientada a Server Components y ergonomía táctil en smartphones.
* [x] **Motor WebAssembly en Rust (`proyecta-core-wasm`):**
  * Hashing FNV-1a de 32/64 bits para anonimato de un solo sentido.
  * Algoritmo del "Deluluómetro" (nivel de proyección de 0% a 100%).
  * Generación de semillas de entropía local para privacidad sin rastreo.
* [x] **Sistema de Máscaras y Alter Egos:** 6 identidades satíricas desbloqueadas (*El Espejo Silencioso*, *Delulu en Fase Terminal*, etc.).
* [x] **Feed Inspirado en X / TikTok:** Pestañas de *Virales*, *Últimas* y *Nivel Delulu*, con contadores interactivos de reacciones (`🔥`, `😂`, `😭`, `💀`, `👀`).
* [x] **Laboratorio WASM en Vivo:** Panel interactivo para ejecutar benchmarks comparativos de rendimiento (WASM vs JS) en el procesador del móvil.
* [x] **PWA Móvil:** Manifiesto web, iconos adaptativos y soporte de instalación directa en Android y iOS.

---

### 🟡 Fase 2: Integración Nativa en Cloudflare (En Progreso)
* [x] **Configuración `wrangler.jsonc`:** Definición de bindings para D1, R2, KV y Pages.
* [x] **Esquema de Base de Datos D1 con Drizzle ORM:** Modelado de tablas `users`, `sessions`, `projections`, `comments`, `reactions` y `moderation_reports`.
* [x] **Protección Antispam con Cloudflare Turnstile:** Verificación sin fricción ni captchas para envíos de proyecciones.
* [ ] **Endpoints Edge API en Cloudflare Pages:**
  * `POST /api/projections`: Guardado directo en Cloudflare D1 con validación Turnstile.
  * `GET /api/projections`: Lectura paginada optimizada para no sobrepasar la cuota de 5M filas/día.
* [ ] **Caché en Cloudflare KV:** Almacenamiento temporal de proyecciones en tendencia durante 120 segundos para reducir lecturas en D1.

---

### 🔵 Fase 3: Cuentas Anónimas con Passkeys y Respaldo Opcional
* [ ] **Autenticación Better Auth en el Edge:**
  * Creación transparente de sesión anónima al abrir la app por primera vez.
* [ ] **Passkeys Biométricas (WebAuthn):**
  * Registro de huella dactilar o FaceID con un toque para respaldar la cuenta anónima sin pedir contraseñas ni correos.
* [ ] **Fusión de Cuentas (Account Linking):**
  * Posibilidad de enlazar correo o cuenta de Google si el usuario desea sincronizar entre varios dispositivos.

---

### 🟣 Fase 4: Multimedia y Desahogos en Audio Efímero
* [ ] **Soporte de Memes y Capturas en Cloudflare R2:**
  * Subida de imágenes comprimidas en el cliente antes de la subida.
  * Cero costo de ancho de banda de salida gracias a las políticas *egress-free* de R2.
* [ ] **Desahogos en Audio de 15 Segundos:**
  * Grabación directa desde el teléfono.
  * Modulador de voz local en WebAssembly (para alterar el tono y proteger la identidad vocal del usuario).

---

### 🔴 Fase 5: Hilos Efímeros y Salas Grupales de Catarsis
* [ ] **Modo 24 Horas (Historias de Desahogo):** Proyecciones que se autodestruyen automáticamente tras 24 horas en D1.
* [ ] **Salas Grupales por Temática:** Cuartos anónimos en tiempo real (ej. *"Sobrevivientes de Situationships"*, *"No le escribas a las 3 AM"*).
* [ ] **Exportador de Tarjetas para Instagram Stories / TikTok:** Generador visual en canvas/WASM para compartir capturas estilizadas del Deluluómetro.
