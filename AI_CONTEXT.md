# AI Context — Proyecta Social Codebase

Este archivo proporciona el contexto técnico, arquitectónico y de convenciones para cualquier modelo de lenguaje o agente de inteligencia artificial que colabore en el desarrollo de **Proyecta**.

---

## 🎯 Visión y Propósito del Proyecto
* **Nombre de la Aplicación:** Proyecta (Red Social Anónima).
* **Propósito:** Plataforma web y PWA móvil para compartir desahogos, anécdotas de desamor y cultura pop viral (*"me proyecté durísimo"*, *situationships*, *canon events*) bajo **anonimato criptográfico**.
* **Diferenciador Clave:** La app no solo muestra publicaciones, sino que evalúa en tiempo real el grado de autodecepción o desahogo con un motor **WebAssembly (WASM) escrito en Rust** ("El Deluluómetro").
* **Infraestructura de Despliegue:** Cloudflare Pages con Cloudflare D1 (SQLite en el Edge), Cloudflare Turnstile (antispam) y Cloudflare R2 (almacenamiento de medios).

---

## 👤 Perfil del Usuario y Restricciones de Desarrollo

1. **Dispositivo Principal:** El usuario gestiona y prueba la aplicación desde un **teléfono móvil** (sin PC). La interfaz táctil, las áreas seguras (`pb-safe`, `pt-safe`), la navegación inferior y el rendimiento en pantallas móviles son de máxima prioridad.
2. **Estilo Visual:** No le agrada el minimalismo extremo. La interfaz debe ser rica, expresiva, con gradientes sutiles, microinteracciones, tarjetas bien delimitadas y tipografía con jerarquía marcada.
3. **Navegación Modular:** Nada de agrupar todas las funciones en una sola pantalla saturada. Las secciones deben estar claramente divididas en pestañas (*Feed*, *Explorar*, *Laboratorio WASM*, *Bóveda de Máscaras*) con modales emergentes para acciones secundarias.
4. **Política de Dependencias:** Usar dependencias reconocidas y funcionales antes que reinventar la rueda con soluciones manuales frágiles. Las licencias deben ser permisivas (MIT, Apache 2.0).
5. **Estabilidad del Código:** No modificar lógica ni diseño que ya funcione a menos que sea explícitamente solicitado por el usuario.
6. **Explicación en Código:** Todos los archivos de lógica deben incluir comentarios explicativos que detallen el propósito de sus funciones.
7. **Rendimiento Móvil:** Nunca bloquear el hilo principal de la interfaz; delegar tareas intensivas a WebAssembly o ejecución asíncrona.

---

## 💻 Convenciones del Stack

### 1. Framework y Componentes
* **Next.js 15 (App Router):** Enrutamiento basado en carpetas bajo `app/`.
* **Componentes:** Separar la lógica pesada en `components/` y mantener `app/page.tsx` como orquestador limpio.
* **Iconos:** Importar exclusivamente desde `lucide-react`. No crear SVGs inline improvisados.
* **Animaciones:** Utilizar `motion` importado desde `'motion/react'`.

### 2. WebAssembly (Rust)
* El código nativo en Rust reside en `rust-wasm/src/lib.rs`.
* La interfaz con el navegador se gestiona en `lib/wasm-engine.ts`, el cual valida e instancia el bytecode WebAssembly estándar o su fallback de alta fidelidad.

### 3. Base de Datos y Edge (Cloudflare)
* El esquema de base de datos se define con **Drizzle ORM** en `lib/db/schema.ts` para **Cloudflare D1**.
* La configuración del despliegue en Cloudflare se centraliza en `wrangler.jsonc`.
* La protección contra bots se realiza con **Cloudflare Turnstile** en `lib/turnstile.ts`.
