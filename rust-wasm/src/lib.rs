//! ============================================================================
//! PROYECTA CORE WASM (RUST)
//! ============================================================================
//! Motor criptográfico y de análisis de proyección psicológica en WebAssembly.
//!
//! Responsabilidades:
//! 1. Hasheo criptográfico rápido (FNV-1a de 32 y 64 bits con sal difusa).
//! 2. Generación de tokens anónimos sin almacenar direcciones IP o huellas de dispositivo.
//! 3. Cálculo de puntuación de proyección delulu (0 a 100) según factores léxicos y semánticos.
//! 4. Algoritmo de mezcla de entropía determinista en memoria lineal aislada.
//! ============================================================================

use wasm_bindgen::prelude::*;

// Configurar el asignador de memoria ultraligero wee_alloc para binarios diminutos (<25KB)
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// Constantes criptográficas FNV-1a (Fowler-Noll-Vo)
const FNV_PRIME_32: u32 = 16777619;
const FNV_OFFSET_BASIS_32: u32 = 2166136261;

const FNV_PRIME_64: u64 = 1099511628211;
const FNV_OFFSET_BASIS_64: u64 = 14695981039346656037;

/// Estructura principal expuesta a JavaScript para el cálculo en el navegador
#[wasm_bindgen]
pub struct ProjectionCore {
    session_seed: u32,
}

#[wasm_bindgen]
impl ProjectionCore {
    /// Constructor: Inicializa la instancia con una semilla de entropía local
    #[wasm_bindgen(constructor)]
    pub fn new(seed: u32) -> Self {
        Self {
            session_seed: seed ^ 0x5DEECE66D,
        }
    }

    /// Calcula la puntuación de proyección psicológica en escala 0 a 100
    /// 
    /// # Argumentos
    /// * `text_len`: Longitud total del texto en caracteres
    /// * `triggers`: Número de palabras o frases desencadenantes detectadas
    /// * `exclamations`: Cantidad de signos de exclamación (intensidad)
    /// * `questions`: Cantidad de signos de interrogación (duda/ansiedad)
    #[wasm_bindgen]
    pub fn calculate_score(
        &self,
        text_len: u32,
        triggers: u32,
        exclamations: u32,
        questions: u32,
    ) -> u32 {
        let length_weight = (text_len / 4).min(30);
        let trigger_weight = triggers * 14;
        let emotion_weight = (exclamations * 5) + (questions * 4);

        let total = length_weight + trigger_weight + emotion_weight;

        // Normalizar en rango 12 a 99 con tope de 100
        if total > 100 {
            100
        } else if total < 12 {
            12
        } else {
            total
        }
    }

    /// Hashea un arreglo de bytes utilizando FNV-1a de 32 bits con sal
    #[wasm_bindgen]
    pub fn hash_fnv1a(&self, data: &[u8]) -> u32 {
        let mut hash = FNV_OFFSET_BASIS_32;
        for &byte in data {
            hash ^= byte as u32;
            hash = hash.wrapping_mul(FNV_PRIME_32);
        }
        hash ^ self.session_seed
    }

    /// Genera un token anónimo criptográfico de 64 bits representado en hexadecimal
    #[wasm_bindgen]
    pub fn generate_anon_token(&self, payload: &[u8], timestamp: u64) -> String {
        let mut hash = FNV_OFFSET_BASIS_64;
        for &byte in payload {
            hash ^= byte as u64;
            hash = hash.wrapping_mul(FNV_PRIME_64);
        }

        // Mezclar con timestamp y semilla para resistencia a correlación
        let mixed = hash ^ (timestamp.wrapping_mul(0x9E3779B97F4A7C15)) ^ (self.session_seed as u64);
        format!("anon_0x{:016X}", mixed)
    }

    /// Mezclador determinista de entropía para asignación aleatoria de avatares anónimos
    #[wasm_bindgen]
    pub fn mix_entropy(&self, val: u32, salt: u32) -> u32 {
        let mixed = val
            .wrapping_mul(1103515245)
            .wrapping_add(salt)
            .wrapping_add(12345);
        mixed & 0x7FFFFFFF
    }

    /// Benchmark de rendimiento: Ejecuta N iteraciones completas
    #[wasm_bindgen]
    pub fn run_benchmark(&self, iterations: u32, sample_bytes: &[u8]) -> u32 {
        let mut accumulator: u32 = FNV_OFFSET_BASIS_32;
        for i in 0..iterations {
            let score = self.calculate_score(sample_bytes.len() as u32, 3, 2, 1);
            let b = sample_bytes[(i as usize) % sample_bytes.len()];
            accumulator ^= (score ^ (b as u32)).wrapping_mul(FNV_PRIME_32);
        }
        accumulator
    }
}

// ============================================================================
// FUNCIONES FREESTANDING ABI (Compatibilidad directa con WASM MVP sin bindgen)
// ============================================================================
// Permiten llamar al módulo desde cualquier entorno que cargue directamente el .wasm

#[no_mangle]
pub extern "C" fn calc_score(len: i32, triggers: i32, marks: i32, questions: i32) -> i32 {
    let mut score = (len / 4) + (triggers * 14) + (marks * 5) + (questions * 4);
    if score > 100 {
        score = 100;
    }
    score
}

#[no_mangle]
pub extern "C" fn hash_step(current_hash: i32, byte_val: i32) -> i32 {
    let h = (current_hash ^ byte_val) as u32;
    (h.wrapping_mul(FNV_PRIME_32)) as i32
}

#[no_mangle]
pub extern "C" fn mix_entropy(seed: i32, salt: i32) -> i32 {
    let s = seed as u32;
    let mixed = s.wrapping_mul(1103515245).wrapping_add(salt as u32).wrapping_add(12345);
    (mixed & 0x7FFFFFFF) as i32
}
