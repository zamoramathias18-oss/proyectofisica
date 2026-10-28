/**
 * Relatividad en Acción - Laboratorio Virtual de Espacio y Tiempo
 * simulations.js - Implementación de ecuaciones físicas de la Relatividad Especial y General,
 * renderizadores interactivos HTML5 Canvas y animaciones para los 8 módulos.
 */

// Module scope encapsulates simulations
(function() {
    // --- FUNCIONES FÍSICAS REUTILIZABLES ---

    /**
     * Calcula el factor de Lorentz γ = 1 / sqrt(1 - (v/c)^2)
     * Validaciones: v debe estar en [0, 1)
     */
    function calculateLorentzFactor(vOverC) {
        if (isNaN(vOverC) || vOverC < 0) {
            throw new Error("La velocidad no puede ser negativa ni un valor no numérico.");
        }
        if (vOverC >= 1.0) {
            throw new Error("La velocidad debe ser estrictamente menor que la velocidad de la luz c (v < 1.0c).");
        }
        return 1.0 / Math.sqrt(1.0 - (vOverC * vOverC));
    }

    /**
     * Suma relativista de velocidades w = (u + v) / (1 + u*v/c^2)
     */
    function calculateVelocityAddition(uOverC, vOverC) {
        if (isNaN(uOverC) || isNaN(vOverC)) {
            throw new Error("Las velocidades deben ser valores numéricos.");
        }
        if (Math.abs(uOverC) >= 1.0 || Math.abs(vOverC) >= 1.0) {
            throw new Error("Las velocidades deben ser menores que c.");
        }
        return (uOverC + vOverC) / (1.0 + (uOverC * vOverC));
    }


    // ==========================================================================
    // MÓDULO 1: SISTEMAS DE REFERENCIA Y POSTULADOS
    // ==========================================================================
    function initModule1() {
        const canvas = document.getElementById("m1-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const sliderV = document.getElementById("m1-v-slider");
        const valV = document.getElementById("m1-v-val");
        const readVa = document.getElementById("m1-read-va");
        const btnStart = document.getElementById("m1-btn-start");
        const btnPause = document.getElementById("m1-btn-pause");
        const btnReset = document.getElementById("m1-btn-reset");

        let v = parseFloat(sliderV.value);
        let isRunning = true;
        let trainX = 100;
        let lightRelX = 0; // Posición del haz dentro del tren
        let lightSpeed = 3.0; // Velocidad del pulso de luz en píxeles/frame

        function updateValues() {
            v = parseFloat(sliderV.value);
            valV.textContent = v.toFixed(2);
            readVa.textContent = v.toFixed(2);
        }

        sliderV.addEventListener("input", updateValues);

        btnStart.addEventListener("click", () => { isRunning = true; });
        btnPause.addEventListener("click", () => { isRunning = false; });
        btnReset.addEventListener("click", () => {
            trainX = 100;
            lightRelX = 0;
            isRunning = true;
        });

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (isRunning) {
                trainX += v * 2.5;
                if (trainX > canvas.width - 220) trainX = 20;

                lightRelX += lightSpeed;
                if (lightRelX > 180) lightRelX = 0;
            }

            // Dibujar Fondo (Espacio/Vía)
            ctx.fillStyle = "#090d16";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Vía de tren / Suelo
            ctx.strokeStyle = "#475569";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(0, 240);
            ctx.lineTo(canvas.width, 240);
            ctx.stroke();

            // Observador A (Fijo en Tierra)
            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.arc(60, 220, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#f8fafc";
            ctx.font = "12px sans-serif";
            ctx.fillText("Observador A (Tierra)", 15, 200);

            // Vagón del Tren / Plataforma
            ctx.fillStyle = "#1e293b";
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 2;
            ctx.fillRect(trainX, 120, 200, 100);
            ctx.strokeRect(trainX, 120, 200, 100);

            // Ruedas del Tren
            ctx.fillStyle = "#94a3b8";
            ctx.beginPath();
            ctx.arc(trainX + 30, 230, 10, 0, Math.PI * 2);
            ctx.arc(trainX + 170, 230, 10, 0, Math.PI * 2);
            ctx.fill();

            // Observador B (En el Tren)
            ctx.fillStyle = "#10b981";
            ctx.beginPath();
            ctx.arc(trainX + 30, 160, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#f8fafc";
            ctx.fillText("Observador B", trainX + 10, 140);

            // Pulso de Luz (Objeto B) dentro del vagón
            ctx.fillStyle = "#f59e0b";
            ctx.shadowColor = "#f59e0b";
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(trainX + 10 + lightRelX, 180, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow

            // Etiquetas de Velocidad de la Luz
            ctx.fillStyle = "#38bdf8";
            ctx.fillText("Pulso de Luz (v_luz = c)", trainX + 10 + lightRelX - 30, 168);

            requestAnimationFrame(animate);
        }

        updateValues();
        animate();
    }


    // ==========================================================================
    // MÓDULO 2: DILATACIÓN DEL TIEMPO (RELOJ DE LUZ)
    // ==========================================================================
    function initModule2() {
        const canvas = document.getElementById("m2-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const inputV = document.getElementById("m2-v-input");
        const sliderV = document.getElementById("m2-v-slider");
        const inputDtau = document.getElementById("m2-dtau-input");
        const errorDiv = document.getElementById("m2-error");

        const resBeta = document.getElementById("m2-res-beta");
        const resGamma = document.getElementById("m2-res-gamma");
        const resDt = document.getElementById("m2-res-dt");

        const btnCalc = document.getElementById("m2-btn-calc");
        const btnSave = document.getElementById("m2-btn-save");
        const savedTableBody = document.getElementById("m2-saved-table")?.querySelector("tbody");

        let currentBeta = 0.60;
        let currentDtau = 10.0;
        let currentGamma = 1.25;
        let currentDt = 12.50;

        let photonY = 20; // Dirección vertical (0 a 160)
        let photonDir = 1;
        let testCount = 0;

        // Sincronización entre Slider e Input
        inputV.addEventListener("input", () => {
            sliderV.value = inputV.value;
            calculateAndDraw();
        });
        sliderV.addEventListener("input", () => {
            inputV.value = sliderV.value;
            calculateAndDraw();
        });
        inputDtau.addEventListener("input", calculateAndDraw);

        function calculateAndDraw() {
            errorDiv.hidden = true;
            errorDiv.textContent = "";

            const vVal = parseFloat(inputV.value);
            const dtauVal = parseFloat(inputDtau.value);

            try {
                if (isNaN(vVal) || inputV.value.trim() === "") throw new Error("Ingresa un valor numérico para la velocidad v/c.");
                if (isNaN(dtauVal) || dtauVal <= 0) throw new Error("El tiempo propio Δτ debe ser mayor que 0.");

                const gamma = calculateLorentzFactor(vVal);
                const dt = gamma * dtauVal;

                currentBeta = vVal;
                currentDtau = dtauVal;
                currentGamma = gamma;
                currentDt = dt;

                resBeta.textContent = currentBeta.toFixed(3);
                resGamma.textContent = currentGamma.toFixed(3);
                resDt.textContent = `${currentDt.toFixed(2)} s`;

            } catch (err) {
                errorDiv.hidden = false;
                errorDiv.textContent = err.message;
            }
        }

        btnCalc.addEventListener("click", calculateAndDraw);

        btnSave.addEventListener("click", () => {
            if (!errorDiv.hidden) return;
            testCount++;
            if (savedTableBody) {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${testCount}</td>
                    <td>${currentBeta.toFixed(2)} c</td>
                    <td>${currentDtau.toFixed(1)} s</td>
                    <td>${currentGamma.toFixed(3)}</td>
                    <td><strong>${currentDt.toFixed(2)} s</strong></td>
                `;
                savedTableBody.appendChild(tr);
            }
            // También enviar a la tabla experimental general
            if (window.addResultToExperimentalTable) {
                window.addResultToExperimentalTable(
                    "Módulo 2 (Dilatación)",
                    `${currentBeta.toFixed(2)}c`,
                    `${currentDtau.toFixed(1)} s`,
                    currentGamma.toFixed(3),
                    `${currentDt.toFixed(2)} s`
                );
            }
        });

        // Animación del Reloj de Luz
        function renderClock() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Fondo
            ctx.fillStyle = "#090d16";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Reloj de Reposo (Lado Izquierdo)
            const r1X = 120;
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(r1X - 60, 40, 120, 160);
            ctx.strokeStyle = "#3b82f6";
            ctx.lineWidth = 2;
            ctx.strokeRect(r1X - 60, 40, 120, 160);

            // Espejos
            ctx.fillStyle = "#94a3b8";
            ctx.fillRect(r1X - 50, 45, 100, 8);
            ctx.fillRect(r1X - 50, 187, 100, 8);

            // Fotón en Reposo
            photonY += photonDir * 3;
            if (photonY > 180 || photonY < 50) photonDir *= -1;

            ctx.fillStyle = "#f59e0b";
            ctx.shadowColor = "#f59e0b";
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(r1X, photonY, 6, 0, Math.PI * 2);
            ctx.fill();

            // Reloj en Movimiento (Lado Derecho)
            const r2X = 420;
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(r2X - 80, 40, 160, 160);
            ctx.strokeStyle = "#06b6d4";
            ctx.strokeRect(r2X - 80, 40, 160, 160);

            // Espejos en movimiento
            ctx.fillStyle = "#94a3b8";
            ctx.fillRect(r2X - 70, 45, 140, 8);
            ctx.fillRect(r2X - 70, 187, 140, 8);

            // Trayectoria en Diagonal de la luz vista desde fuera
            const dx = currentBeta * 45;
            ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(r2X - dx, 50);
            ctx.lineTo(r2X, 185);
            ctx.lineTo(r2X + dx, 50);
            ctx.stroke();
            ctx.setLineDash([]);

            // Fotón diagonal
            const tRatio = (photonY - 50) / 130;
            const p2X = r2X - dx + (tRatio * dx * 2);
            ctx.beginPath();
            ctx.arc(p2X, photonY, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Etiquetas
            ctx.fillStyle = "#f8fafc";
            ctx.font = "13px sans-serif";
            ctx.fillText("Reloj en Reposo (Δτ)", r1X - 55, 230);
            ctx.fillText(`Reloj en Movimiento (v=${currentBeta.toFixed(2)}c)`, r2X - 75, 230);

            requestAnimationFrame(renderClock);
        }

        calculateAndDraw();
        renderClock();
    }


    // ==========================================================================
    // MÓDULO 3: CONTRACCIÓN DE LA LONGITUD
    // ==========================================================================
    function initModule3() {
        const canvas = document.getElementById("m3-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const inputL0 = document.getElementById("m3-l0-input");
        const inputV = document.getElementById("m3-v-input");
        const sliderV = document.getElementById("m3-v-slider");
        const errorDiv = document.getElementById("m3-error");

        const resL0 = document.getElementById("m3-res-l0");
        const resGamma = document.getElementById("m3-res-gamma");
        const resL = document.getElementById("m3-res-l");

        let currentL0 = 100.0;
        let currentV = 0.80;
        let currentGamma = 1.667;
        let currentL = 60.0;

        inputV.addEventListener("input", () => {
            sliderV.value = inputV.value;
            calculate();
        });
        sliderV.addEventListener("input", () => {
            inputV.value = sliderV.value;
            calculate();
        });
        inputL0.addEventListener("input", calculate);

        function calculate() {
            errorDiv.hidden = true;
            errorDiv.textContent = "";

            const l0Val = parseFloat(inputL0.value);
            const vVal = parseFloat(inputV.value);

            try {
                if (isNaN(l0Val) || l0Val <= 0) throw new Error("La longitud propia L0 debe ser un número mayor a 0.");
                if (isNaN(vVal) || inputV.value.trim() === "") throw new Error("Ingresa una velocidad v/c válida.");

                const gamma = calculateLorentzFactor(vVal);
                const l = l0Val / gamma;

                currentL0 = l0Val;
                currentV = vVal;
                currentGamma = gamma;
                currentL = l;

                resL0.textContent = `${currentL0.toFixed(1)} m`;
                resGamma.textContent = currentGamma.toFixed(3);
                resL.textContent = `${currentL.toFixed(2)} m`;

                drawSpaceships();

            } catch (err) {
                errorDiv.hidden = false;
                errorDiv.textContent = err.message;
            }
        }

        function drawSpaceships() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Fondo espacial
            ctx.fillStyle = "#070a12";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Escala visual
            const scale = 2.0; // Píxeles por metro
            const height = 40; // Alto fijo de la nave (la dimensión perpendicular NO se contrae)

            // Nave 1: En Reposo (L0)
            const ship1Width = Math.min(canvas.width - 150, currentL0 * scale);
            const y1 = 50;

            ctx.fillStyle = "#38bdf8";
            ctx.beginPath();
            ctx.moveTo(80, y1 + height / 2);
            ctx.lineTo(80 + ship1Width - 20, y1);
            ctx.lineTo(80 + ship1Width, y1 + height / 2);
            ctx.lineTo(80 + ship1Width - 20, y1 + height);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = "#e0f2fe";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = "#ffffff";
            ctx.font = "12px sans-serif";
            ctx.fillText(`Nave en reposo (Marco propio): L₀ = ${currentL0.toFixed(1)} m`, 80, y1 - 12);

            // Nave 2: En Movimiento (L contraída en la dirección x)
            const ship2Width = Math.min(canvas.width - 150, currentL * scale);
            const y2 = 150;

            ctx.fillStyle = "#f59e0b";
            ctx.beginPath();
            ctx.moveTo(80, y2 + height / 2);
            ctx.lineTo(80 + ship2Width - 15, y2);
            ctx.lineTo(80 + ship2Width, y2 + height / 2);
            ctx.lineTo(80 + ship2Width - 15, y2 + height);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = "#fef3c7";
            ctx.stroke();

            ctx.fillStyle = "#ffffff";
            ctx.fillText(`Nave vista a v = ${currentV.toFixed(2)}c: L = ${currentL.toFixed(2)} m (Contracción solo en eje X)`, 80, y2 - 12);
        }

        calculate();
    }


    // ==========================================================================
    // MÓDULO 4: RELATIVIDAD DE LA SIMULTANEIDAD
    // ==========================================================================
    function initModule4() {
        const canvas = document.getElementById("m4-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const sliderV = document.getElementById("m4-v-slider");
        const valV = document.getElementById("m4-v-val");
        const btnFlash = document.getElementById("m4-btn-flash");
        const btnReset = document.getElementById("m4-btn-reset");
        const readout = document.getElementById("m4-readout");

        let v = parseFloat(sliderV.value);
        let trainX = 150;
        let isFlashing = false;
        let waveRadius = 0;

        sliderV.addEventListener("input", () => {
            v = parseFloat(sliderV.value);
            valV.textContent = v.toFixed(2);
        });

        btnFlash.addEventListener("click", () => {
            isFlashing = true;
            waveRadius = 0;
            readout.innerHTML = `<p><strong>Ondas de luz emitidas:</strong> Para la vía, los destellos salieron al mismo tiempo de ambos puntos de la vía. Para el observador del tren, este avanza hacia la luz frontal y se aleja de la trasera.</p>`;
        });

        btnReset.addEventListener("click", () => {
            isFlashing = false;
            waveRadius = 0;
            trainX = 150;
            readout.innerHTML = `<p>Haz clic en <strong>"Emitir Destellos"</strong> para iniciar la propagación de las ondas de luz.</p>`;
        });

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Fondo
            ctx.fillStyle = "#090d16";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Vía
            ctx.strokeStyle = "#475569";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, 200);
            ctx.lineTo(canvas.width, 200);
            ctx.stroke();

            // Observador Vía (Centro)
            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.arc(300, 220, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#f8fafc";
            ctx.font = "12px sans-serif";
            ctx.fillText("Observador Vía (Centro)", 235, 245);

            // Tren
            const trainWidth = 240;
            if (isFlashing) {
                trainX += v * 2;
                waveRadius += 2.5; // Velocidad de expansión de la luz c
            }

            ctx.fillStyle = "#1e293b";
            ctx.strokeStyle = "#06b6d4";
            ctx.lineWidth = 2;
            ctx.fillRect(trainX, 100, trainWidth, 80);
            ctx.strokeRect(trainX, 100, trainWidth, 80);

            // Observador Tren (Centro del tren)
            const obsTrenX = trainX + trainWidth / 2;
            ctx.fillStyle = "#10b981";
            ctx.beginPath();
            ctx.arc(obsTrenX, 140, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillText("Observador Tren", obsTrenX - 45, 125);

            // Extremos A (Izquierda) y B (Derecha)
            ctx.fillStyle = "#f59e0b";
            ctx.fillText("Extremo A", trainX - 10, 90);
            ctx.fillText("Extremo B", trainX + trainWidth - 40, 90);

            // Ondas de Luz en propagación
            if (isFlashing) {
                ctx.strokeStyle = "#f59e0b";
                ctx.lineWidth = 2;

                // Onda A (emitida en x=150)
                ctx.beginPath();
                ctx.arc(150, 140, waveRadius, 0, Math.PI * 2);
                ctx.stroke();

                // Onda B (emitida en x=390)
                ctx.beginPath();
                ctx.arc(390, 140, waveRadius, 0, Math.PI * 2);
                ctx.stroke();
            }

            requestAnimationFrame(animate);
        }

        animate();
    }


    // ==========================================================================
    // MÓDULO 5: SUMA RELATIVISTA DE VELOCIDADES
    // ==========================================================================
    function initModule5() {
        const canvas = document.getElementById("m5-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const inputV = document.getElementById("m5-v-input");
        const inputU = document.getElementById("m5-u-input");
        const errorDiv = document.getElementById("m5-error");
        const btnCalc = document.getElementById("m5-btn-calc");

        const resClasica = document.getElementById("m5-res-clasica");
        const resRelativista = document.getElementById("m5-res-relativista");

        function calculate() {
            errorDiv.hidden = true;
            errorDiv.textContent = "";

            const vVal = parseFloat(inputV.value);
            const uVal = parseFloat(inputU.value);

            try {
                if (isNaN(vVal) || isNaN(uVal)) throw new Error("Por favor ingresa valores numéricos para ambas velocidades.");
                if (vVal < 0 || uVal < 0) throw new Error("Las velocidades deben ser mayores o iguales a 0.");
                if (vVal >= 1.0 || uVal >= 1.0) throw new Error("Las velocidades de entrada deben ser menores a c (1.0).");

                const wClasica = vVal + uVal;
                const wRelativista = calculateVelocityAddition(uVal, vVal);

                resClasica.textContent = `${wClasica.toFixed(2)} c`;
                resRelativista.textContent = `${wRelativista.toFixed(4)} c`;

                drawGraph(wClasica, wRelativista);

            } catch (err) {
                errorDiv.hidden = false;
                errorDiv.textContent = err.message;
            }
        }

        btnCalc.addEventListener("click", calculate);

        function drawGraph(wClasica, wRelativista) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#090d16";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const maxBarWidth = 380;
            const y1 = 60;
            const y2 = 130;

            // Barra 1: Clásica
            const bar1Width = Math.min(canvas.width - 180, (wClasica / 2.0) * maxBarWidth);
            ctx.fillStyle = "#ef4444";
            ctx.fillRect(150, y1, bar1Width, 30);
            ctx.fillStyle = "#ffffff";
            ctx.font = "13px sans-serif";
            ctx.fillText("Suma Clásica:", 20, y1 + 20);
            ctx.fillText(`${wClasica.toFixed(2)}c`, 160 + bar1Width, y1 + 20);

            // Barra 2: Relativista
            const bar2Width = (wRelativista / 2.0) * maxBarWidth;
            ctx.fillStyle = "#06b6d4";
            ctx.fillRect(150, y2, bar2Width, 30);
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Suma Relativista:", 20, y2 + 20);
            ctx.fillText(`${wRelativista.toFixed(4)}c`, 160 + bar2Width, y2 + 20);

            // Línea límite c = 1.0
            const cX = 150 + (1.0 / 2.0) * maxBarWidth;
            ctx.strokeStyle = "#f59e0b";
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.moveTo(cX, 30);
            ctx.lineTo(cX, 180);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = "#f59e0b";
            ctx.fillText("Límite insuperable c = 1.00", cX - 60, 20);
        }

        calculate();
    }


    // ==========================================================================
    // MÓDULO 6: PRINCIPIO DE EQUIVALENCIA
    // ==========================================================================
    function initModule6() {
        const canvas = document.getElementById("m6-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const selectMode = document.getElementById("m6-select-mode");
        const btnDrop = document.getElementById("m6-btn-drop");
        const btnReset = document.getElementById("m6-btn-reset");
        const readout = document.getElementById("m6-readout");

        let ballY = 50;
        let ballVy = 0;
        let lightX = 0;
        let lightY = 100;
        let isAnimating = false;

        btnDrop.addEventListener("click", () => {
            ballY = 50;
            ballVy = 0;
            lightX = 0;
            lightY = 100;
            isAnimating = true;
        });

        btnReset.addEventListener("click", () => {
            isAnimating = false;
            ballY = 50;
            ballVy = 0;
            lightX = 0;
            lightY = 100;
            updateText();
        });

        selectMode.addEventListener("change", updateText);

        function updateText() {
            const mode = selectMode.value;
            if (mode === "earth") {
                readout.innerHTML = `<p><strong>Gravedad Terrestre:</strong> El ascensor está en reposo en la Tierra. El objeto cae con aceleración g = 9.8 m/s² y la luz se curva de forma imperceptible localmente.</p>`;
            } else if (mode === "rocket") {
                readout.innerHTML = `<p><strong>Cohete Acelerado:</strong> El ascensor en el espacio profundo acelera a a = 9.8 m/s². La inercia hace que la pelota "caiga" hacia el suelo exactamente con la misma trayectoria que en la Tierra.</p>`;
            } else {
                readout.innerHTML = `<p><strong>Caída Libre:</strong> El ascensor cae libremente en un campo gravitatorio. El objeto flota respecto al observador interior (Gravedad Cero Aparente / Imponderabilidad).</p>`;
            }
        }

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Fondo
            ctx.fillStyle = "#090d16";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Dibuja Ascensor
            const eX = 200;
            const eY = 30;
            const eWidth = 200;
            const eHeight = 220;

            ctx.fillStyle = "#1e293b";
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 3;
            ctx.fillRect(eX, eY, eWidth, eHeight);
            ctx.strokeRect(eX, eY, eWidth, eHeight);

            // Animación del objeto soltado
            if (isAnimating) {
                const mode = selectMode.value;
                if (mode === "earth" || mode === "rocket") {
                    ballVy += 0.25;
                    ballY += ballVy;
                    if (ballY > eHeight - 20) ballY = eHeight - 20;

                    lightX += 4;
                    lightY += 0.05 * (lightX * 0.1) * (lightX * 0.1);
                } else if (mode === "freefall") {
                    // En caída libre flota
                    lightX += 4;
                }
            }

            // Dibuja Pelota
            ctx.fillStyle = "#f59e0b";
            ctx.beginPath();
            ctx.arc(eX + 50, eY + ballY, 10, 0, Math.PI * 2);
            ctx.fill();

            // Dibuja Haz de Luz
            if (isAnimating && lightX > 0) {
                ctx.fillStyle = "#06b6d4";
                ctx.beginPath();
                ctx.arc(eX + Math.min(eWidth, lightX), eY + lightY, 4, 0, Math.PI * 2);
                ctx.fill();
            }

            requestAnimationFrame(render);
        }

        updateText();
        render();
    }


    // ==========================================================================
    // MÓDULO 7: GRAVEDAD, LUZ Y TIEMPO (RELATIVIDAD GENERAL)
    // ==========================================================================
    function initModule7() {
        const canvas = document.getElementById("m7-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const subtabs = document.querySelectorAll(".subtab-btn");
        const massSlider = document.getElementById("m7-mass-slider");
        const massVal = document.getElementById("m7-mass-val");
        const readout = document.getElementById("m7-readout");

        let activeSubtab = "grid";
        let mass = parseInt(massSlider.value);

        subtabs.forEach(tab => {
            tab.addEventListener("click", () => {
                subtabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                activeSubtab = tab.dataset.subtab;
                updateReadout();
            });
        });

        massSlider.addEventListener("input", () => {
            mass = parseInt(massSlider.value);
            massVal.textContent = mass;
            updateReadout();
        });

        function updateReadout() {
            if (activeSubtab === "grid") {
                readout.innerHTML = `<p><strong>Malla Espacio-Temporal:</strong> Deformación de la cuadrícula geométrica por una masa central M = ${mass} M☉. Recuerda que es una analogía 2D simplificada.</p>`;
            } else if (activeSubtab === "light") {
                readout.innerHTML = `<p><strong>Desviación Gravitacional de la Luz:</strong> Un rayo luminoso sigue una línea geodésica curvada al pasar cerca de la masa M = ${mass} M☉.</p>`;
            } else if (activeSubtab === "time") {
                readout.innerHTML = `<p><strong>Dilatación Gravitacional del Tiempo:</strong> El reloj ubicado cerca de la masa (M = ${mass} M☉) marcha más despacio que un reloj lejano en el espacio exterior.</p>`;
            }
        }

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#070a12";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cX = canvas.width / 2;
            const cY = canvas.height / 2;

            if (activeSubtab === "grid") {
                // Render Malla Deformada
                ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
                ctx.lineWidth = 1;

                const step = 25;
                for (let x = 0; x < canvas.width; x += step) {
                    for (let y = 0; y < canvas.height; y += step) {
                        const dist = Math.hypot(x - cX, y - cY);
                        const factor = Math.max(0, 1 - (dist / (mass * 30)));
                        const warpX = (cX - x) * factor * 0.3;
                        const warpY = (cY - y) * factor * 0.3;

                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + step + warpX, y + warpY);
                        ctx.stroke();
                    }
                }

                // Objeto Masivo Central
                ctx.fillStyle = "#f59e0b";
                ctx.shadowColor = "#f59e0b";
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(cX, cY, 12 + mass * 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

            } else if (activeSubtab === "light") {
                // Rayo de luz curvo
                ctx.fillStyle = "#ef4444";
                ctx.beginPath();
                ctx.arc(cX, cY, 12 + mass * 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = "#06b6d4";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(20, cY - 80);

                for (let x = 20; x < canvas.width - 20; x += 5) {
                    const dist = Math.hypot(x - cX, cY - 80 - cY);
                    const bend = (mass * 1200) / (dist * dist + 1000);
                    ctx.lineTo(x, cY - 80 + bend);
                }
                ctx.stroke();

            } else if (activeSubtab === "time") {
                // Dos Relojes
                ctx.fillStyle = "#ef4444";
                ctx.beginPath();
                ctx.arc(cX, cY, 12 + mass * 2, 0, Math.PI * 2);
                ctx.fill();

                // Reloj Cerca
                ctx.fillStyle = "#1e293b";
                ctx.strokeStyle = "#f59e0b";
                ctx.fillRect(cX + 30, cY - 20, 90, 40);
                ctx.strokeRect(cX + 30, cY - 20, 90, 40);
                ctx.fillStyle = "#ffffff";
                ctx.font = "11px sans-serif";
                ctx.fillText("Reloj Cerca: Lento", cX + 35, cY + 5);

                // Reloj Lejano
                ctx.fillRect(50, 40, 100, 40);
                ctx.strokeRect(50, 40, 100, 40);
                ctx.fillText("Reloj Lejano: Rápido", 55, 65);
            }

            requestAnimationFrame(render);
        }

        updateReadout();
        render();
    }


    // ==========================================================================
    // MÓDULO 8: RELATIVIDAD EN EL SISTEMA GPS
    // ==========================================================================
    function initModule8() {
        const canvas = document.getElementById("m8-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const inputDays = document.getElementById("m8-days-input");
        const btnCalc = document.getElementById("m8-btn-calc");

        const resSr = document.getElementById("m8-res-sr");
        const resGr = document.getElementById("m8-res-gr");
        const resTotal = document.getElementById("m8-res-total");
        const resDist = document.getElementById("m8-res-dist");

        let angle = 0;

        function calculate() {
            const days = parseFloat(inputDays.value) || 1;
            const srOffset = -7.0 * days;
            const grOffset = 45.0 * days;
            const totalOffset = srOffset + grOffset; // +38 microsegundos/día

            // Error acumulado ~ 38us * 300,000 km/s ≈ 11.4 km por día
            const distError = (totalOffset * 1e-6) * 300000;

            resSr.textContent = `${srOffset.toFixed(1)} μs`;
            resGr.textContent = `+${grOffset.toFixed(1)} μs`;
            resTotal.textContent = `+${totalOffset.toFixed(1)} μs`;
            resDist.textContent = `~${distError.toFixed(1)} km`;
        }

        btnCalc.addEventListener("click", calculate);

        function renderOrbit() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#070a12";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cX = canvas.width / 2;
            const cY = canvas.height / 2;

            // Tierra
            ctx.fillStyle = "#3b82f6";
            ctx.beginPath();
            ctx.arc(cX, cY, 40, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.font = "12px sans-serif";
            ctx.fillText("Tierra", cX - 16, cY + 4);

            // Órbita
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.arc(cX, cY, 85, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // Satélite GPS
            angle += 0.015;
            const satX = cX + 85 * Math.cos(angle);
            const satY = cY + 85 * Math.sin(angle);

            ctx.fillStyle = "#f59e0b";
            ctx.beginPath();
            ctx.arc(satX, satY, 7, 0, Math.PI * 2);
            ctx.fill();

            // Paneles solares del satélite
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(satX - 12, satY);
            ctx.lineTo(satX + 12, satY);
            ctx.stroke();

            requestAnimationFrame(renderOrbit);
        }

        calculate();
        renderOrbit();
    }


    // --- INICIALIZACIÓN GENERAL AL CARGAR EL DOM ---
    document.addEventListener("DOMContentLoaded", () => {
        initModule1();
        initModule2();
        initModule3();
        initModule4();
        initModule5();
        initModule6();
        initModule7();
        initModule8();
    });

})();
