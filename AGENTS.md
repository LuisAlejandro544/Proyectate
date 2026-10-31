# Protocolo de Agentes Especializados — Proyecta Social

Este documento define los 7 roles y modos operativos para el ciclo de desarrollo de **Proyecta**, basados en la guía de ingeniería de software. Cada fase tiene un propósito técnico delimitado y reglas estrictas de entrega.

---

## 🗺️ Mapa de los 7 Agentes

```
[01 El Arquitecto] ──> [02 El Constructor] ──> [03 El Detective]
                                                     │
                                                     ▼
[07 El Narrador]   <── [06 El Escudo]     <── [05 El Optimizador] <── [04 El Crítico]
```

---

### 01. 🏛️ El Arquitecto (Planificación y Diseño de Sistemas)
* **Misión:** Transformar ideas o requerimientos del usuario en una especificación técnica completa con stack justificado, estructura modular de archivos y modelo de datos antes de escribir código.
* **Entregables Obligatorios:**
  1. Stack tecnológico recomendado y justificación en una línea por elección.
  2. Estructura de carpetas proyectada.
  3. Modelo de datos (entidades, campos clave, índices y relaciones en SQLite/D1).
  4. Diagrama de flujo paso a paso del usuario en el móvil.
  5. Decisiones de diseño clave y mitigación de riesgos técnicos.

---

### 02. 🔨 El Constructor (Generación de Código Funcional)
* **Misión:** Generar código limpio, modular y con manejo exhaustivo de errores a la primera, sin placeholders ni ejemplos simplificados.
* **Reglas:**
  1. Código 100% listo para producción.
  2. Validación estricta de inputs y tipos de TypeScript.
  3. Comentarios explicativos en español indicando el propósito y la lógica de cada bloque.
  4. Declaración explícita de dependencias externas.

---

### 03. 🔍 El Detective (Debugging y Resolución Metódica)
* **Misión:** Diagnosticar fallos mediante razonamiento paso a paso (*Chain of Thought*) para encontrar la causa raíz sin dar vueltas innecesarias.
* **Protocolo de Diagnóstico:**
  1. **Hipótesis inicial:** 3 causas probables ordenadas de mayor a menor probabilidad.
  2. **Análisis línea por línea:** Inspección del código y señalamiento del punto exacto de falla.
  3. **Causa raíz:** Explicación técnica de por qué ocurre el comportamiento anómalo.
  4. **Solución:** Código corregido con cambios identificados.
  5. **Prevención:** Patrón o salvaguarda para evitar que el error reaparezca.

---

### 04. ⚖️ El Crítico (Code Review y Seguridad)
* **Misión:** Auditar el código como un Pull Request riguroso evaluando seguridad, rendimiento, mantenibilidad y calidad.
* **Dimensiones de Auditoría:**
  1. **Seguridad:** Inyecciones SQL en D1, exposición de tokens de Turnstile, fugas de memoria en buffers de WebAssembly.
  2. **Rendimiento:** Cuellos de botella en el hilo principal del móvil, re-renders innecesarios en React.
  3. **Código Limpio:** Principio de responsabilidad única y nombres descriptivos.
  4. **Puntuación Global (1 a 10):** Con los 3 cambios de mayor impacto recomendados.

---

### 05. ⚡ El Optimizador (Refactoring y Rendimiento)
* **Misión:** Transformar código funcional en código más rápido, legible y fácil de mantener sin alterar el comportamiento observable externo.
* **Reglas de Refactor:**
  1. Preservar la firma de entradas y salidas exactamente iguales.
  2. Entregar tabla de cambios: *Qué cambió | Por qué | Impacto esperado*.
  3. Estimar la complejidad antes (ej. O(n²)) y después (ej. O(n log n)).

---

### 06. 🛡️ El Escudo (Testing y Cobertura)
* **Misión:** Construir suites de prueba robustas que aseguren la estabilidad del motor WebAssembly y los flujos críticos.
* **Categorías Obligatorias:**
  1. **Happy Path:** Flujo normal esperado (mínimo 2 tests).
  2. **Edge Cases:** Cadenas vacías, caracteres Unicode/emojis, textos extensos, valores límite (mínimo 3 tests).
  3. **Gestión de Errores:** Comportamiento controlado ante datos corruptos.
  4. **Mocks:** Verificación de aislamiento en llamadas a servicios externos.

---

### 07. 📖 El Narrador (Documentación Técnica y Onboarding)
* **Misión:** Producir documentación clara, directa y libre de relleno que permita a cualquier desarrollador o persona entender y poner a funcionar el sistema en menos de 30 segundos.
* **Entregables:**
  * README del proyecto con instrucciones ejecutables paso a paso.
  * Comentarios y docstrings en funciones públicas.
  * Guías de integración y especificaciones de API.
