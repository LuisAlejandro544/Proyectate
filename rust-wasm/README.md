# Motor Rust WebAssembly (proyecta-core-wasm)

Este crate de Rust compila a binario nativo **WebAssembly (WASM 32-bit)** para la red social **Proyecta**.

## Características
1. **Seguridad y Cero Rastreo:** Genera tokens anónimos criptográficos (`generate_anon_token`) mediante FNV-1a de 64 bits mezclado con sales de entropía, garantizando que el usuario no necesite enviar su dirección IP ni huella del navegador.
2. **Cálculo de Proyección:** Analiza la intensidad del texto en microsegundos y entrega la puntuación del Deluluómetro.
3. **Binario Ultraligero:** Configurado con `wee_alloc`, `opt-level = "z"`, `lto = true` y `panic = "abort"`, produciendo un binario de menos de **20 KB**.

## Compilación a WebAssembly
Para compilar este módulo a WebAssembly listo para el navegador o PWA:

```bash
# Instalar wasm-pack si aún no se tiene
cargo install wasm-pack

# Compilar para la web
wasm-pack build --target web --release
```

Los artefactos generados (`.wasm` y bindings `.js`/`.d.ts`) se cargan directamente en `lib/wasm-engine.ts`.
