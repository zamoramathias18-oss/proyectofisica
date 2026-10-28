# Relatividad en Acción: Laboratorio Virtual de Espacio y Tiempo

**Proyecto Educativo de Física de Undécimo Año**
*Adaptado para el currículo de educación secundaria (Costa Rica)*

---

## 📌 Descripción General

**"Relatividad en acción: laboratorio virtual de espacio y tiempo"** es una aplicación web educativa interactiva desarrollada en español, diseñada para servir como un laboratorio virtual completo donde los estudiantes de 11.º año exploren los principios y predicciones cuantitativas y cualitativas de la **Relatividad Especial (1905)** y la **Relatividad General (1915)** de Albert Einstein.

La aplicación permite a los estudiantes seguir procedimientos guiados, modificar variables físicas, visualizar simulaciones en tiempo real en canvas HTML5, registrar datos en tablas interactivas, responder preguntas de análisis basadas en evidencia y exportar sus informes en formato CSV.

---

## 🚀 Características Principales

1. **Funcionamiento 100% Sin Conexión (Offline):** Construido únicamente con HTML5, CSS3 y JavaScript Vanilla. Sin frameworks, CDNs, fuentes externas ni servicios de terceros.
2. **Diseño Responsive y Accesible:** Interfaz moderna con temática espacial, compatible con computadoras, tabletas y teléfonos móviles, cumpliendo con estándares de contraste adecuado y navegación por teclado.
3. **8 Módulos Educativos Interactivos:**
   - **Módulo 1:** Sistemas de Referencia y Postulados de la Relatividad Especial.
   - **Módulo 2:** Dilatación del Tiempo (Modelo interactivo del reloj de luz).
   - **Módulo 3:** Contracción de la Longitud (Nave espacial y dirección del movimiento).
   - **Módulo 4:** Relatividad de la Simultaneidad (Experimento del tren y destellos).
   - **Módulo 5:** Suma Relativista de Velocidades ($w = \frac{u'+v}{1+u'v/c^2}$).
   - **Módulo 6:** Principio de Equivalencia (Simulación del ascensor de Einstein).
   - **Módulo 7:** Gravedad, Luz y Tiempo (Curvatura, geodésicas y dilatación gravitacional).
   - **Módulo 8:** Relatividad en el Sistema GPS (Corrección cinemática y gravitacional real).
4. **Sección de Experimentos ("Realiza el laboratorio"):**
   - Planteamiento de preguntas de investigación e hipótesis del estudiante.
   - Tabla de datos interactiva editable con adición/eliminación de filas y exportación automática a **CSV**.
   - Preguntas de análisis cualitativo y cuantitativo.
   - **Solucionario para docentes** desplegable para facilitar la revisión del profesor.
5. **Fuentes e Información Bibliográfica:** Referencias académicas verificadas de OpenStax, Einstein Online (Max Planck Institute) y NIST.

---

## 📁 Estructura del Proyecto

```text
/
├── index.html              # Interfaz de usuario y maquetación principal
├── css/
│   └── styles.css          # Estilos visuales, tema espacial y media queries responsive
├── js/
│   ├── app.js              # Control de navegación, avance, tabla de datos y exportación a CSV
│   └── simulations.js      # Ecuaciones físicas y animaciones HTML5 Canvas
├── tests/
│   └── verify_physics.js   # Script de verificación de fórmulas físicas y validación
└── README.md               # Documentación completa e instrucciones de uso
```

---

## 💻 Instrucciones para Abrir y Usar la Aplicación

1. **Descarga del Proyecto:**
   Descarga la carpeta completa del proyecto o clona el repositorio en tu computadora.

2. **Ejecución Local (Sin Internet):**
   No se requiere un servidor local ni conexión a Internet. Haz doble clic en el archivo `index.html` para abrirlo directamente en tu navegador preferido (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari o navegadores móviles).

3. **Navegación e Interacción:**
   - Utiliza la barra superior de navegación para desplazarte entre los módulos 1 al 8.
   - Ajusta los deslizadores o campos numéricos para cambiar la velocidad ($v/c$), tiempo propio ($\Delta\tau$), longitud propia ($L_0$), masa ($M$) o días de funcionamiento en el GPS.
   - Al finalizar cada módulo, haz clic en el botón **"Marcar como completado"** para registrar tu avance en la barra superior.
   - Dirígete a la pestaña **"Realiza el laboratorio"** para registrar tus experimentos, descargar el archivo CSV con tus mediciones y completar las preguntas de análisis.

---

## 🧪 Pruebas Realizadas y Resultados

Para garantizar la precisión física y la estabilidad de la aplicación, se ejecutó la suite de pruebas en `tests/verify_physics.js` mediante Node.js:

| Prueba | Valor de Entrada | Resultado Esperado | Resultado Módulo | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **Factor Lorentz en reposo** | $\beta = 0.0$ | $\gamma = 1.000$ | $\gamma = 1.000$ | ✅ Pasó |
| **Factor Lorentz a 0.6c** | $\beta = 0.6$ | $\gamma = 1.250$ | $\gamma = 1.250$ | ✅ Pasó |
| **Factor Lorentz a 0.8c** | $\beta = 0.8$ | $\gamma = 1.6667$ | $\gamma = 1.6667$ | ✅ Pasó |
| **Contracción de longitud** | $L_0 = 100\text{ m}, v = 0.8c$ | $L = 60.00\text{ m}$ | $L = 60.00\text{ m}$ | ✅ Pasó |
| **Suma de velocidades** | $u' = 0.7c, v = 0.7c$ | $w = 0.9396c (< c)$ | $w = 0.9396c$ | ✅ Pasó |
| **Validación $v \ge c$** | $v = 1.0c \text{ ó } 1.2c$ | Lanza mensaje de error | Bloqueado / Mensaje activo | ✅ Pasó |
| **Validación Entradas Nulas** | Texto vacío o $v < 0$ | Lanza mensaje de error | Bloqueado / Mensaje activo | ✅ Pasó |
| **Exportación CSV** | Click en "Exportar a CSV" | Genera archivo con UTF-8 BOM y encabezados | Archivo descargable | ✅ Pasó |

---

## ⚠️ Limitaciones de los Modelos Educativos

Es de vital importancia que los estudiantes y docentes reconozcan las siguientes limitaciones inherentes a la simulación por computadora:

1. **Modelos Simulados vs. Demostración Experimental Real:** La simulación muestra las *predicciones teóricas* de la matemática relativista; no constituye una prueba experimental directa por sí misma.
2. **Analogía de la Malla Espacio-Temporal (Módulo 7):** La "malla bidimensional elástica que se hunde" es una representación didáctica bidimensional. En el universo real, la gravedad es la curvatura de la geometría tetradimensional (tres dimensiones espaciales y una temporal).
3. **Efectos Cerca de Objeto Masivos:** Los cálculos del GPS y la aceleración en el ascensor utilizan aproximaciones de campo débil ($g \approx \text{constante}$ y métrica débil de Schwarzschild), adecuadas para secundaria y sin entrar en el formalismo de tensores de Einstein.
4. **Métricas Perpendiculares:** La simulación enfatiza correctamente que la contracción espacial solo afecta el eje del movimiento relativo ($x$), manteniendo invariantes las dimensiones perpendiculares.

---

## 📚 Fuentes y Créditos

- **OpenStax, Rice University:** Ling, S. J., Sanny, J., & Moebs, W. (2016). *University Physics Volume 3*. Capítulo 5: Relativity.
- **Max Planck Institute for Gravitational Physics (Albert Einstein Institute):** *Einstein Online: Elementary concepts of relativity*.
- **National Institute of Standards and Technology (NIST):** *Time and Frequency Division: Relativistic Time Dilation and GPS Satellite Clocks*.
