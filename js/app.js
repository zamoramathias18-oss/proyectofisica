/**
 * Relatividad en Acción - Laboratorio Virtual de Espacio y Tiempo
 * app.js - Lógica principal de la aplicación, navegación, eventos de interfaz,
 * validación de entradas, gestión de tablas y exportación de datos a CSV.
 */

document.addEventListener("DOMContentLoaded", () => {
    // State management for progress
    const completedModules = new Set();
    const TOTAL_MODULES = 8;

    // --- NAVEGACIÓN ENTRE MÓDULOS ---
    const navButtons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".module-section");

    function switchSection(targetId) {
        sections.forEach(sec => {
            if (sec.id === targetId) {
                sec.classList.add("active");
            } else {
                sec.classList.remove("active");
            }
        });

        navButtons.forEach(btn => {
            if (btn.dataset.target === targetId) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        // Trigger resize on canvases in active section if needed
        window.dispatchEvent(new Event('resize'));
    }

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.target;
            switchSection(target);
        });
    });

    // Delegación de clics en tarjetas de resumen en la página de inicio
    const overviewItems = document.querySelectorAll(".overview-item");
    overviewItems.forEach((item, index) => {
        item.style.cursor = "pointer";
        item.addEventListener("click", () => {
            switchSection(`mod${index + 1}`);
        });
    });

    // --- GESTIÓN DE PROGRESO DE MÓDULOS ---
    const completeButtons = document.querySelectorAll(".toggle-complete-btn");
    const progressText = document.getElementById("progress-text");
    const progressBarFill = document.getElementById("progress-bar-fill");
    const progressBarElement = document.getElementById("progress-bar-element");

    function updateProgressUI() {
        const count = completedModules.size;
        const percentage = Math.round((count / TOTAL_MODULES) * 100);
        progressText.textContent = `${count} de ${TOTAL_MODULES} módulos completados (${percentage}%)`;
        progressBarFill.style.width = `${percentage}%`;
        if (progressBarElement) {
            progressBarElement.setAttribute("aria-valuenow", percentage);
        }
    }

    completeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modId = btn.dataset.mod;
            if (completedModules.has(modId)) {
                completedModules.delete(modId);
                btn.textContent = "☐ Marcar como completado";
                btn.classList.remove("btn-primary");
                btn.classList.add("btn-secondary");
            } else {
                completedModules.add(modId);
                btn.textContent = "☑ Módulo completado";
                btn.classList.remove("btn-secondary");
                btn.classList.add("btn-primary");
            }
            updateProgressUI();
        });
    });

    // --- SOLUCIONARIO DOCENTE DESPLEGABLE ---
    const btnToggleTeacher = document.getElementById("btn-toggle-teacher");
    const teacherContent = document.getElementById("teacher-content");

    if (btnToggleTeacher && teacherContent) {
        btnToggleTeacher.addEventListener("click", () => {
            const isHidden = teacherContent.hidden;
            teacherContent.hidden = !isHidden;
            btnToggleTeacher.textContent = isHidden ? "🙈 Ocultar Solucionario Docente" : "👁️ Mostrar Solucionario Docente";
        });
    }

    // --- SECCIÓN EXPERIMENTAL Y TABLA DE DATOS ---
    const tableBody = document.getElementById("exp-table-body");
    const btnAddRow = document.getElementById("exp-btn-add-row");
    const btnClearTable = document.getElementById("exp-btn-clear-table");
    const btnExportCSV = document.getElementById("exp-btn-export-csv");

    // Filas iniciales por defecto
    const initialData = [
        { mod: "Módulo 2 (Dilatación)", v: "0.00c", inVal: "10.0 s", gamma: "1.000", resVal: "10.00 s" },
        { mod: "Módulo 2 (Dilatación)", v: "0.60c", inVal: "10.0 s", gamma: "1.250", resVal: "12.50 s" },
        { mod: "Módulo 2 (Dilatación)", v: "0.80c", inVal: "10.0 s", gamma: "1.667", resVal: "16.67 s" },
        { mod: "Módulo 3 (Contracción)", v: "0.80c", inVal: "100.0 m", gamma: "1.667", resVal: "60.00 m" }
    ];

    function renderInitialRows() {
        if (!tableBody) return;
        tableBody.innerHTML = "";
        initialData.forEach((item, index) => {
            appendTableRow(index + 1, item.mod, item.v, item.inVal, item.gamma, item.resVal);
        });
    }

    function appendTableRow(num, mod, v, inVal, gamma, resVal) {
        if (!tableBody) return;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${num || tableBody.children.length + 1}</td>
            <td contenteditable="true">${mod}</td>
            <td contenteditable="true">${v}</td>
            <td contenteditable="true">${inVal}</td>
            <td contenteditable="true">${gamma}</td>
            <td contenteditable="true">${resVal}</td>
            <td><button class="btn btn-tertiary btn-danger-text delete-row-btn" style="padding:0.2rem 0.5rem; font-size:0.8rem;">❌</button></td>
        `;

        tr.querySelector(".delete-row-btn").addEventListener("click", () => {
            tr.remove();
            reindexTableRows();
        });

        tableBody.appendChild(tr);
    }

    function reindexTableRows() {
        if (!tableBody) return;
        Array.from(tableBody.children).forEach((tr, index) => {
            tr.children[0].textContent = index + 1;
        });
    }

    if (btnAddRow) {
        btnAddRow.addEventListener("click", () => {
            appendTableRow(tableBody.children.length + 1, "Módulo Personalizado", "0.50c", "10.0", "1.155", "11.55");
        });
    }

    if (btnClearTable) {
        btnClearTable.addEventListener("click", () => {
            if (confirm("¿Estás seguro de que deseas borrar todas las filas de la tabla de datos?")) {
                tableBody.innerHTML = "";
            }
        });
    }

    // EXPORTACIÓN A CSV
    if (btnExportCSV) {
        btnExportCSV.addEventListener("click", () => {
            const rows = [];
            // Encabezados
            rows.push(["Numero", "Modulo", "Velocidad(v/c)", "Variable_Entrada", "Factor_Lorentz(gamma)", "Resultado_Medido"]);

            const trs = tableBody.querySelectorAll("tr");
            trs.forEach(tr => {
                const cols = tr.querySelectorAll("td");
                if (cols.length >= 6) {
                    const rowData = [
                        cols[0].textContent.trim(),
                        `"${cols[1].textContent.trim().replace(/"/g, '""')}"`,
                        `"${cols[2].textContent.trim().replace(/"/g, '""')}"`,
                        `"${cols[3].textContent.trim().replace(/"/g, '""')}"`,
                        `"${cols[4].textContent.trim().replace(/"/g, '""')}"`,
                        `"${cols[5].textContent.trim().replace(/"/g, '""')}"`
                    ];
                    rows.push(rowData);
                }
            });

            // Generación de CSV Blob
            const csvContent = "\uFEFF" + rows.map(e => e.join(",")).join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "datos_laboratorio_relatividad.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }

    // Inicializar tabla experimental al cargar
    renderInitialRows();
});

/**
 * Función global auxiliar para agregar un resultado calculado directamente desde un módulo
 */
window.addResultToExperimentalTable = function(modName, vFormatted, inValFormatted, gammaFormatted, resValFormatted) {
    const tableBody = document.getElementById("exp-table-body");
    if (!tableBody) return;

    const num = tableBody.children.length + 1;
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${num}</td>
        <td contenteditable="true">${modName}</td>
        <td contenteditable="true">${vFormatted}</td>
        <td contenteditable="true">${inValFormatted}</td>
        <td contenteditable="true">${gammaFormatted}</td>
        <td contenteditable="true">${resValFormatted}</td>
        <td><button class="btn btn-tertiary btn-danger-text delete-row-btn" style="padding:0.2rem 0.5rem; font-size:0.8rem;">❌</button></td>
    `;

    tr.querySelector(".delete-row-btn").addEventListener("click", () => {
        tr.remove();
        const trs = tableBody.querySelectorAll("tr");
        trs.forEach((row, idx) => { row.children[0].textContent = idx + 1; });
    });

    tableBody.appendChild(tr);
};
