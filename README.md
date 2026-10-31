# Proyecta — Red Social Anónima con WebAssembly (Rust) en Cloudflare Pages

> **"El lugar donde admitir que te proyectaste no da vergüenza, da risa y catarsis."**

Proyecta es una red social y PWA móvil inspirada en X (Twitter) construida para compartir desahogos, anécdotas de psicología pop (*"me proyecté durísimo"*, *"momento delulu"*, *situationships*, *canon events*) y pensamientos espontáneos bajo **anonimato criptográfico absoluto**.

Toda la evaluación del nivel de proyección ("Deluluómetro") y el hasheo de privacidad se ejecutan en el propio teléfono del usuario a través de un motor **WebAssembly (WASM de 32 bits)** escrito en **Rust**. La infraestructura de backend está optimizada para **Cloudflare Pages**, utilizando **Cloudflare D1 (SQLite en el Edge)**, **Cloudflare Turnstile (Antispam invisible sin CAPTCHA)** y **Cloudflare R2** para almacenamiento de medios con coste $0 de ancho de banda de salida.

---

## 🚀 Características Principales

* **🎭 Máscaras y Alter Egos Dinámicos:** En lugar de perfiles estáticos o usuarios anónimos vacíos, los usuarios eligen máscaras temáticas de psicología pop (*El Espejo Silencioso*, *Delulu en Fase Terminal*, *Paciente sin Alta*, *Ghostwriter de Indirectas*).
* **⚡ Motor Rust en WebAssembly:** Cómputo criptográfico de privacidad local (FNV-1a / Murmur) y análisis léxico en microsegundos, sin enviar IPs ni cookies de rastreo al servidor.
* **☁️ Stack Nativo Cloudflare (100% Generoso):**
  * **Hosting:** Cloudflare Pages + Edge Functions.
  * **Base de datos:** Cloudflare D1 (hasta 5 millones de lecturas y 100.000 escrituras al día gratis, sin pausas por inactividad).
  * **Seguridad:** Cloudflare Turnstile para prevenir bots de spam de forma invisible.
  * **Multimedia:** Cloudflare R2 con 10 GB y cero cobro por salida de datos (*egress free*).
* **📱 PWA Móvil Optimizada:** Diseñada para pantallas táctiles de teléfonos móviles, con soporte offline, instalación en pantalla de inicio y navegación por pestañas ergonómica.
* **📊 Laboratorio WebAssembly en Vivo:** Benchmark interactivo en tiempo real que mide la velocidad de ejecución de WebAssembly frente a JavaScript en el procesador del smartphone.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Justificación |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (App Router) + React 19 + TypeScript | Rendimiento, Server Components y renderizado táctil fluido. |
| **Estilos** | Tailwind CSS v4 + Motion | Diseño oscuro moderno, microinteracciones y ergonomía táctil. |
| **Cómputo en Cliente** | **Rust + WebAssembly (WASM 32-bit)** | Cero Garbage Collector, privacidad criptográfica local y análisis ultrarrápido. |
| **Base de Datos** | **Cloudflare D1 (SQLite en el Edge)** | 5M lecturas/día gratis, latencia ultra baja en el Edge y Drizzle ORM. |
| **Antispam** | **Cloudflare Turnstile** | Protección invisible ilimitada contra bots sin captchas invasivos. |
| **Almacenamiento** | **Cloudflare R2** | 10 GB gratis al mes y $0 por transferencia de datos de salida. |

---

## 📋 Requisitos Previos

* **Node.js**: Versión `20.x` o superior (se recomienda Node 22 LTS).
* **npm** o **pnpm**.
* *(Opcional para compilar Rust localmente)*: **Rust** (edición 2021+) y `wasm-pack`.

---

## 📦 Instalación y Puesta en Marcha

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/tu-usuario/proyecta.git
cd proyecta
npm install
```

### 2. Configurar variables de entorno
Copia el archivo `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```
Abre en tu navegador (o en el navegador de tu teléfono conectado a la red local):
```
http://localhost:3000
```

---

## ⚙️ Variables de Entorno

| Variable | Descripción | ¿Obligatoria? | Valor por Defecto |
| :--- | :--- | :---: | :--- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Clave pública del widget de Cloudflare Turnstile | No (en local) | `1x00000000000000000000AA` (Modo pruebas) |
| `TURNSTILE_SECRET_KEY` | Clave secreta para validación de tokens en backend | No (en local) | `1x0000000000000000000000000000000AA` |
| `BETTER_AUTH_SECRET` | Llave simétrica de cifrado para sesiones seguras | Sí (prod) | Cadena aleatoria de 32+ caracteres |
| `BETTER_AUTH_URL` | URL canónica de la aplicación | Sí (prod) | `https://proyecta.pages.dev` |
| `GEMINI_API_KEY` | Clave de API para diagnósticos y generación contextual | Opcional | Clave privada en servidor |

---

## 🧪 Pruebas y Benchmarks

### Ejecutar verificación de tipos y compilación
```bash
npm run build
```

### Ejecutar el Benchmark de WebAssembly en el teléfono
1. Abre la aplicación en tu navegador móvil.
2. Toca en la pestaña inferior **"WASM Lab"** (icono de microchip ⚡).
3. Selecciona la cantidad de iteraciones (ej. 50.000 a 100.000).
4. Presiona **"Iniciar Benchmark"** para ver la aceleración porcentual de WebAssembly frente al motor JavaScript estándar.

---

## 🌐 Despliegue en Cloudflare Pages

El proyecto incluye el archivo de configuración `wrangler.jsonc` listo para el ecosistema Cloudflare:

### 1. Iniciar sesión en Cloudflare CLI
```bash
npx wrangler login
```

### 2. Crear la base de datos D1
```bash
npx wrangler d1 create proyecta-db
```
Copia el `database_id` devuelto y colócalo en `wrangler.jsonc`.

### 3. Aplicar las migraciones de base de datos
```bash
npx wrangler d1 migrations apply proyecta-db --remote
```

### 4. Desplegar en Cloudflare Pages
```bash
npx wrangler pages deploy .next
```
O conecta tu repositorio de GitHub directamente a la consola web de **Cloudflare Pages**. El despliegue será automático en cada commit.

---

## 📄 Licencia

Este proyecto está distribuido bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
