const assert = require('assert');

// Test suite for physics calculations, error handling, and CSV formatting

function calculateLorentzFactor(vOverC) {
    if (typeof vOverC !== 'number' || isNaN(vOverC) || vOverC < 0) {
        throw new Error("La velocidad no puede ser negativa ni un valor no numérico.");
    }
    if (vOverC >= 1.0) {
        throw new Error("La velocidad debe ser estrictamente menor que la velocidad de la luz c (v < 1.0c).");
    }
    return 1.0 / Math.sqrt(1.0 - (vOverC * vOverC));
}

function calculateVelocityAddition(uOverC, vOverC) {
    if (typeof uOverC !== 'number' || typeof vOverC !== 'number' || isNaN(uOverC) || isNaN(vOverC)) {
        throw new Error("Las velocidades deben ser valores numéricos.");
    }
    if (Math.abs(uOverC) >= 1.0 || Math.abs(vOverC) >= 1.0) {
        throw new Error("Las velocidades deben ser menores que c.");
    }
    return (uOverC + vOverC) / (1.0 + (uOverC * vOverC));
}

console.log("=== INICIANDO PRUEBAS DE VALIDACIÓN Y CÁLCULOS FÍSICOS ===");

// 1. Prueba beta = 0
const g0 = calculateLorentzFactor(0.0);
assert.strictEqual(g0, 1.0, "Beta 0 debe dar gamma = 1.0");
console.log("✔ Pasó: v = 0.0c -> gamma = 1.0");

// 2. Prueba beta = 0.6
const g06 = calculateLorentzFactor(0.6);
assert.strictEqual(g06, 1.25, "Beta 0.6 debe dar gamma = 1.25");
console.log("✔ Pasó: v = 0.6c -> gamma = 1.25");

// 3. Prueba beta = 0.8
const g08 = calculateLorentzFactor(0.8);
assert.strictEqual(Math.round(g08 * 10000) / 10000, 1.6667, "Beta 0.8 debe dar gamma ~ 1.6667");
console.log("✔ Pasó: v = 0.8c -> gamma ≈ 1.6667");

// 4. Rechazo de v >= 1.0 (v >= c)
assert.throws(() => calculateLorentzFactor(1.0), /estrictamente menor/, "Debe rechazar v = 1.0c");
assert.throws(() => calculateLorentzFactor(1.2), /estrictamente menor/, "Debe rechazar v = 1.2c");
console.log("✔ Pasó: Validación rechaza v >= c correctamente");

// 5. Rechazo de v < 0 o NaN
assert.throws(() => calculateLorentzFactor(-0.5), /negativa/, "Debe rechazar v negativo");
assert.throws(() => calculateLorentzFactor(NaN), /no numérico/, "Debe rechazar NaN");
console.log("✔ Pasó: Validación rechaza v < 0 y entradas no numéricas");

// 6. Prueba de Contracción de Longitud
const L0 = 100.0;
const L = L0 / g08;
assert.strictEqual(Math.round(L * 100) / 100, 60.00, "L0 = 100m a 0.8c debe dar L = 60m");
console.log("✔ Pasó: Contracción de longitud L0 = 100m, v = 0.8c -> L = 60m");

// 7. Suma de velocidades
const w = calculateVelocityAddition(0.7, 0.7);
assert.strictEqual(Math.round(w * 10000) / 10000, 0.9396, "0.7c + 0.7c debe dar ~ 0.9396c");
console.log("✔ Pasó: Suma de velocidades 0.7c + 0.7c -> w ≈ 0.9396c (< c)");

console.log("=== TODAS LAS PRUEBAS FÍSICAS Y DE VALIDACIÓN SE EJECUTARON CON ÉXITO ===");
