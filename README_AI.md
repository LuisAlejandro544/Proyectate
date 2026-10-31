# Instrucciones de Operación para IA — README_AI.md

Este documento contiene las reglas de oro y restricciones operativas obligatorias para cualquier modelo de IA o asistente que opere sobre este repositorio.

---

## ⚠️ Reglas Críticas Inviolables

1. **Razonar Profundamente Antes de Ejecutar:**
   * Antes de modificar o crear archivos, analiza detalladamente el impacto en la arquitectura general, las dependencias y la compatibilidad con el entorno móvil.
2. **El Usuario Trabaja desde un Teléfono Móvil:**
   * El usuario no tiene PC de escritorio. Todas las instrucciones, comandos y componentes de la UI deben diseñarse teniendo en cuenta pantallas táctiles y navegación con el pulgar.
3. **No al Minimalismo Extremo:**
   * Al usuario le gusta el diseño detallado, expresivo, con personalidad, contrastes claros, insignias visuales y tarjetas delimitadas. Evita interfaces vacías o excesivamente desnudas.
4. **Desarrollo Modular (Pantallas Separadas):**
   * No amontonar múltiples vistas en un solo archivo o pantalla gigantesca. Cada funcionalidad principal debe tener su propio módulo desacoplado (pestañas dedicadas, modales para acciones secundarias).
5. **No Modificar Diseño ni Iconos sin Solicitud Explícita:**
   * Conserva los colores, gradientes, iconos de `lucide-react` y componentes existentes. No rediseñes arbitrariamente partes que ya están aprobadas.
6. **No Alterar la Lógica Existente si no es Necesario:**
   * Un cambio imprevisto en la lógica puede hacer colapsar la aplicación. Respeta los flujos existentes y haz adiciones incrementales.
7. **Explicación en Código:**
   * Cada archivo de código debe tener comentarios claros al inicio y en las funciones clave explicando para qué sirve la lógica.
8. **Gestión Asíncrona sin Bloquear el Hilo Principal:**
   * En dispositivos móviles, el cómputo intensivo debe delegarse a WebAssembly (Rust) o manejarse de forma asíncrona para garantizar 60 fps en las animaciones táctiles.
9. **Licencias de Código:**
   * No agregues dependencias con licencias virales restrictivas (ej. GPL) que obliguen al proyecto a liberar su código o dependencias incompatibles con producción comercial. Usa licencias permisivas (MIT, Apache 2.0, BSD).
10. **Idioma de Commits y Documentación:**
    * Toda la documentación para el usuario y archivos como `commit_message.txt` deben estar redactados en **español**.

---

## 🛠️ Stack Tecnológico Rápido
* **Frontend:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4.
* **Cómputo Local:** Rust compilado a WebAssembly (WASM 32-bit).
* **Backend Edge:** Cloudflare Pages + Cloudflare D1 (SQLite) + Cloudflare Turnstile (antispam) + Cloudflare R2 (storage).
* **Librería de Iconos:** `lucide-react`.
* **Animaciones:** `motion/react`.
