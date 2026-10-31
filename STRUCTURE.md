# Arquitectura de Archivos y Módulos — Proyecta Social

Este documento describe la estructura organizativa de la base de código de **Proyecta**, detallando el propósito y las responsabilidades de cada directorio y archivo clave.

---

## 🌳 Árbol General del Proyecto

```
proyecta/
├── app/                                 # Directorio App Router de Next.js 15
│   ├── globals.css                      # Estilos globales con Tailwind CSS v4 y utilidades móviles
│   ├── layout.tsx                       # Layout raíz con metadatos PWA y configuración viewport táctil
│   ├── manifest.ts                      # Generador dinámico del Web App Manifest para PWA
│   └── page.tsx                         # Orquestador principal de vistas y estado de navegación
│
├── components/                          # Componentes de interfaz de usuario desacoplados
│   ├── CreateProjectionModal.tsx        # Modal de creación de publicación con análisis WASM en vivo
│   ├── ExploreView.tsx                  # Muro de tendencias de TikTok y ranking de proyecciones
│   ├── FeedView.tsx                     # Feed principal (Virales, Últimas, Nivel Delulu)
│   ├── Navigation.tsx                   # Barra de navegación táctil inferior estilo smartphone
│   ├── PostDetailModal.tsx              # Modal de detalle de hilo y comentarios anónimos
│   ├── ProfileVaultView.tsx             # Bóveda de máscaras (alter egos), historial y privacidad
│   ├── ProjectionCard.tsx               # Tarjeta interactiva de proyección con reacciones
│   ├── PWAInstallModal.tsx              # Guía de instalación en pantalla de inicio (Android / iOS)
│   └── WasmLabView.tsx                  # Laboratorio interactivo de WebAssembly y benchmarks
│
├── lib/                                 # Núcleo de lógica de negocio, tipos y almacenamiento
│   ├── db/                              # Integración con base de datos Cloudflare D1
│   │   ├── d1-client.ts                 # Conector Drizzle ORM para Cloudflare D1 en el Edge
│   │   └── schema.ts                    # Esquema de tablas SQLite para D1
│   ├── initial-data.ts                  # Semilla de datos, máscaras por defecto y sincronización LocalStorage
│   ├── turnstile.ts                     # Validación de tokens antispam de Cloudflare Turnstile
│   ├── types.ts                         # Definiciones de TypeScript e interfaces del dominio
│   ├── utils.ts                         # Utilidades de formato de fechas y concatenación de clases Tailwind
│   ├── wasm-engine.test.ts              # Pruebas unitarias del motor de cálculo de proyección
│   └── wasm-engine.ts                   # Adaptador WebAssembly, fallback y analizador psicológico
│
├── rust-wasm/                           # Crate de Rust compilado a WebAssembly (WASM 32-bit)
│   ├── Cargo.toml                       # Configuración de compilación con wee_alloc y LTO
│   ├── README.md                        # Documentación del crate y comandos wasm-pack
│   └── src/
│       └── lib.rs                       # Algoritmos criptográficos FNV-1a y puntuación de proyección
│
├── public/                              # Recursos estáticos de la aplicación
│   ├── icon-192.svg                     # Icono de aplicación para pantallas táctiles (192x192)
│   └── icon-512.svg                     # Icono de alta resolución para PWA (512x512)
│
├── drizzle.config.ts                    # Configuración de migraciones con Drizzle Kit para D1
├── wrangler.jsonc                       # Configuración nativa para Cloudflare Pages, D1, R2 y KV
├── metadata.json                        # Metadatos del applet en AI Studio
├── package.json                         # Dependencias de npm y scripts del ciclo de vida
└── tsconfig.json                        # Configuración de TypeScript con resolución de rutas (@/*)
```

---

## 🏛️ Responsabilidades por Módulo

### 1. `app/` (Enrutador y Vistas de Next.js)
* **`layout.tsx`**: Configura las etiquetas meta para redes sociales y el viewport con `maximumScale: 1` y `userScalable: false` para evitar que el navegador del teléfono haga zoom involuntario al tocar campos de texto.
* **`page.tsx`**: Actúa como controlador central de la PWA. Gestiona la pestaña activa (`feed`, `explore`, `wasm-lab`, `vault`), el alter ego en uso y la persistencia en el dispositivo.

### 2. `components/` (Módulos de UI y Experiencia de Usuario)
* **Modularidad estricta**: Cada pestaña de la aplicación (`FeedView`, `ExploreView`, `WasmLabView`, `ProfileVaultView`) está encapsulada en su propio componente, evitando pantallas monolíticas saturadas.
* **`CreateProjectionModal.tsx`**: Mientras el usuario escribe su desahogo, el motor WebAssembly analiza en tiempo real el texto, calculando el nivel de proyección (Deluluómetro), el diagnóstico psicológico y el hash de anonimato antes de enviar.

### 3. `lib/` (Lógica de Negocio y Persistencia)
* **`lib/wasm-engine.ts`**: Carga el binario WebAssembly en memoria lineal y expone funciones tipadas a JavaScript. Cuenta con fallback funcional automático para entornos donde WebAssembly esté restringido.
* **`lib/db/`**: Modelado de datos en SQLite para Cloudflare D1 mediante Drizzle ORM.
* **`lib/turnstile.ts`**: Valida que las solicitudes provengan de seres humanos sin forzar desafíos molestos.

### 4. `rust-wasm/` (Motor Criptográfico en Rust)
* Código fuente nativo en Rust diseñado para compilarse a bytecode `.wasm` de 32 bits con el flag `wasm32-unknown-unknown`.
* Emplea `wee_alloc` para mantener el tamaño del binario por debajo de los 20 KB.
