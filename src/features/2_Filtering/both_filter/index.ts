// src/features/2_Filtering/both_filter/index.ts
import { Sandbox } from "../../../components/sandbox/sandbox";
import { Gridie } from "../../../gridie/gridie";
import { tsCode, jsCode, htmlCode } from "./sources/sources";

export function render(container: HTMLElement): void {
  container.innerHTML = `
    <div class="feature-layout">
      <!-- Demo Window -->
      <div class="demo-window">
        <div class="window-header">
          <span class="window-title">Demo - Filtros Combinados (Header Filter + Filter Row)</span>
        </div>
        <div class="window-content">
          <h3>Filtrado Avanzado con Dos Capas</h3>
          <p>Gridie permite usar <strong>Header Filter</strong> y <strong>Filter Row</strong> simultáneamente en la misma columna, combinándolos con lógica <strong>AND</strong> para un control preciso de los datos.</p>
          
          <div class="demo-section">
            <h4>¿Cómo Funcionan Juntos?</h4>
            <ul style="list-style: disc; margin-left: 20px; line-height: 1.8;">
              <li><strong>Lógica AND:</strong> Los registros deben cumplir AMBOS filtros simultáneamente</li>
              <li><strong>Header Filter:</strong> Selección rápida por checkboxes (categorías, rangos predefinidos, fechas jerárquicas)</li>
              <li><strong>Filter Row:</strong> Filtrado granular con operadores y valores específicos</li>
              <li><strong>Independientes:</strong> Cada filtro se puede usar solo o combinado</li>
              <li><strong>Flexibilidad:</strong> Combina selección masiva (Header) con búsqueda precisa (Row)</li>
            </ul>

            <div style="margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 8px; border-left: 4px solid #4caf50;">
              <h5 style="margin-top: 0;">✅ Casos de Uso Implementados:</h5>
              <div style="font-size: 0.9em; line-height: 1.8;">
                <p><strong>📝 Nombre:</strong> Header Filter (valores únicos + búsqueda) + Filter Row (contiene, igual, empieza con)</p>
                <p><strong>🏢 Departamento:</strong> Header Filter (parameters con grupos) + Filter Row (igual, no igual, contiene)</p>
                <p><strong>💰 Salario:</strong> Header Filter (rangos: Junior/Mid/Senior) + Filter Row (operadores numéricos con between)</p>
                <p><strong>🌍 Ciudad:</strong> Header Filter (values desde BD) + Filter Row (operadores de string)</p>
                <p><strong>📅 Fecha Ingreso:</strong> Header Filter (jerarquía año→mes + parameters temporales) + Filter Row (rangos de fechas)</p>
                <p><strong>✔️ Activo:</strong> Header Filter (valores booleanos) + Filter Row (igual/no igual)</p>
              </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #fff3e0; border-radius: 8px; border-left: 4px solid #ff9800;">
              <h5 style="margin-top: 0;">💡 Ejemplo Práctico:</h5>
              <div style="background: #fff; padding: 12px; border-radius: 6px; margin-top: 10px;">
                <p style="margin: 0 0 10px 0; font-weight: 600;">Escenario: "Empleados IT Senior que ganen más de $65,000"</p>
                <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li><strong>Header Filter en Departamento:</strong> Selecciona "🖥️ Departamentos Técnicos" (filtra IT, Desarrollo, QA)</li>
                  <li><strong>Filter Row en Departamento:</strong> Escribe "IT" con operador "Igual" (refina a solo IT)</li>
                  <li><strong>Header Filter en Salario:</strong> Selecciona "Senior ($65k+)" (filtra salarios ≥ $65,000)</li>
                  <li><strong>Filter Row en Salario:</strong> Ingresa operador ">" con valor "65000" (precisión adicional)</li>
                </ol>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 0.9em;">
                  <strong>Resultado:</strong> Solo empleados que cumplan TODAS estas condiciones simultáneamente.
                </p>
              </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #f3e5f5; border-radius: 8px; border-left: 4px solid #9c27b0;">
              <h5 style="margin-top: 0;">🎯 Ventajas de Combinar Filtros:</h5>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; font-size: 0.9em; margin-top: 10px;">
                <div style="background: #fff; padding: 10px; border-radius: 6px;">
                  <strong>🚀 Velocidad + Precisión</strong>
                  <p style="margin: 5px 0 0 0; color: #666;">Header Filter para filtrado rápido masivo, Filter Row para ajustes finos</p>
                </div>
                <div style="background: #fff; padding: 10px; border-radius: 6px;">
                  <strong>📊 Análisis Complejo</strong>
                  <p style="margin: 5px 0 0 0; color: #666;">Combina categorías (Header) con rangos específicos (Row) en la misma columna</p>
                </div>
                <div style="background: #fff; padding: 10px; border-radius: 6px;">
                  <strong>🔍 Flexibilidad Total</strong>
                  <p style="margin: 5px 0 0 0; color: #666;">Usa solo uno, ambos, o ninguno según necesites en cada columna</p>
                </div>
                <div style="background: #fff; padding: 10px; border-radius: 6px;">
                  <strong>⚡ UX Mejorada</strong>
                  <p style="margin: 5px 0 0 0; color: #666;">Usuarios pueden elegir su método preferido de filtrado</p>
                </div>
              </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
              <h5 style="margin-top: 0;">⚙️ Configuración:</h5>
              <pre style="background: #fff; padding: 12px; border-radius: 6px; overflow-x: auto; font-size: 0.85em;"><code>{
  label: "Salario",
  type: "number",
  filters: {
    headerFilter: {
      visible: true,
      parameters: [
        { text: "Senior ($65k+)", operator: ">=", value: 65000 }
      ]
    },
    filterRow: {
      visible: true,
      operators: ["=", "<>", "<", ">", "<=", ">=", "between"]
    }
  }
}</code></pre>
              <p style="margin: 10px 0 0 0; color: #555; font-size: 0.9em;">
                ⚠️ <strong>Importante:</strong> Ambos filtros deben cumplirse (AND). Si el Header Filter selecciona "Senior" y el Filter Row pone "&lt; 50000", no habrá resultados.
              </p>
            </div>

            <div style="margin-top: 20px;">
              <button id="addEmployeeBtn" class="demo-button">➕ Agregar Empleado</button>
              <button id="clearFiltersBtn" class="demo-button secondary">🗑️ Limpiar Todos los Filtros</button>
              <button id="exampleFilterBtn" class="demo-button">💡 Ver Ejemplo Práctico</button>
            </div>

            <div id="dataTable" style="margin-top: 20px;"></div>
          </div>
        </div>
      </div>

      <!-- Code Sandbox -->
      <div id="sandboxContainer"></div>
    </div>
  `;

  const gridie = document.createElement("gridie-table") as Gridie;

  const ciudadesDisponibles = ["Santo Domingo", "Santiago", "La Vega", "San Pedro", "Valverde"];

  const config = {
    id: "tabla-filtros-combinados",
    headers: [
      {
        label: "ID",
        type: "number" as const,
        sortable: true,
      },
      {
        label: "Nombre",
        type: "string" as const,
        sortable: true,
        filters: {
          headerFilter: {
            visible: true,
            search: true,
            showCount: true,
          },
          filterRow: {
            visible: true,
            operators: ["contains", "equals", "startswith", "endswith"] as const,
          },
        },
      },
      {
        label: "Departamento",
        type: "string" as const,
        sortable: true,
        filters: {
          headerFilter: {
            visible: true,
            parameters: [
              {
                text: "🖥️ Departamentos Técnicos",
                operator: "in" as const,
                value: ["IT", "Desarrollo", "QA"],
              },
              {
                text: "💼 Departamentos de Negocio",
                operator: "in" as const,
                value: ["Ventas", "Marketing", "RRHH"],
              },
            ],
            values: ["IT", "Ventas", "Marketing", "RRHH", "Desarrollo", "QA", "Finanzas"],
          },
          filterRow: {
            visible: true,
          //  operators: ["equals", "notequals", "contains"] as const,
          },
        },
      },
      {
        label: "Salario",
        type: "number" as const,
        sortable: true,
        filters: {
          headerFilter: {
            visible: true,
            parameters: [
              {
                text: "Junior (<$50k)",
                operator: "<" as const,
                value: 50000,
              },
              {
                text: "Mid ($50k - $65k)",
                operator: "between" as const,
                value: 50000,
                value2: 65000,
              },
              {
                text: "Senior ($65k+)",
                operator: ">=" as const,
                value: 65000,
              },
            ],
          },
          filterRow: {
            visible: true,
            operators: ["=", "<>", "<", ">", "<=", ">=", "between"] as const,
          },
        },
      },
      {
        label: "Ciudad",
        type: "string" as const,
        filters: {
          headerFilter: {
            visible: true,
            values: ciudadesDisponibles,
          },
          filterRow: {
            visible: true,
          },
        },
      },
      {
        label: "Fecha Ingreso",
        type: "date" as const,
        sortable: true,
        filters: {
          headerFilter: {
            visible: true,
            dateHierarchy: ["year", "month"] as const,
            parameters: [
              {
                text: "📅 Este año (2024)",
                operator: "year" as const,
                value: 2024,
              },
              {
                text: "📆 Últimos 6 meses",
                operator: "last" as const,
                value: 6,
                unit: "months" as const,
              },
            ],
          },
          filterRow: {
            visible: true,
            operators: ["=", "<>", "<", ">", "<=", ">=", "between"] as const,
          },
        },
      },
      {
        label: "Activo",
        type: "boolean" as const,
        filters: {
          headerFilter: {
            visible: true,
          },
          filterRow: {
            visible: true,
          },
        },
      },
    ],
    body: [
      { 
        id: 1, nombre: "Juan Pérez", departamento: "IT", salario: 45000, 
        ciudad: "Santo Domingo", fechaIngreso: "2020-03-15", activo: true 
      },
      { 
        id: 2, nombre: "María García", departamento: "Ventas", salario: 52000, 
        ciudad: "Santiago", fechaIngreso: "2019-07-22", activo: true 
      },
      { 
        id: 3, nombre: "Carlos López", departamento: "IT", salario: 48000, 
        ciudad: "La Vega", fechaIngreso: "2021-01-10", activo: true 
      },
      { 
        id: 4, nombre: "Ana Martínez", departamento: "Marketing", salario: 55000, 
        ciudad: "Santo Domingo", fechaIngreso: "2018-11-05", activo: false 
      },
      { 
        id: 5, nombre: "Pedro Rodríguez", departamento: "RRHH", salario: 50000, 
        ciudad: "San Pedro", fechaIngreso: "2020-09-18", activo: true 
      },
      { 
        id: 6, nombre: "Laura Fernández", departamento: "IT", salario: 68000, 
        ciudad: "Santo Domingo", fechaIngreso: "2019-04-30", activo: true 
      },
      { 
        id: 7, nombre: "Miguel Sánchez", departamento: "Ventas", salario: 47000, 
        ciudad: "Santiago", fechaIngreso: "2021-06-12", activo: true 
      },
      { 
        id: 8, nombre: "Isabel Torres", departamento: "Marketing", salario: 53000, 
        ciudad: "La Vega", fechaIngreso: "2020-02-25", activo: true 
      },
      { 
        id: 9, nombre: "Roberto Gómez", departamento: "Desarrollo", salario: 72000, 
        ciudad: "Santo Domingo", fechaIngreso: "2018-03-10", activo: true 
      },
      { 
        id: 10, nombre: "Carmen Díaz", departamento: "QA", salario: 58000, 
        ciudad: "Santiago", fechaIngreso: "2019-08-15", activo: false 
      },
      { 
        id: 11, nombre: "Francisco Ruiz", departamento: "IT", salario: 44000, 
        ciudad: "Valverde", fechaIngreso: "2022-01-08", activo: true 
      },
      { 
        id: 12, nombre: "Patricia Moreno", departamento: "Finanzas", salario: 75000, 
        ciudad: "San Pedro", fechaIngreso: "2020-05-20", activo: true 
      },
    ],
    enableSort: true,
    language: "es" as const,
  };

  gridie.setConfig(config as any);
  document.getElementById("dataTable")?.appendChild(gridie);

  // Botón para agregar empleado
  document.getElementById("addEmployeeBtn")?.addEventListener("click", () => {
    const nombres = ["Roberto", "Sandra", "Miguel", "Patricia", "Diego", "Lucía", "Fernando", "Claudia"];
    const apellidos = ["González", "Ramírez", "Vargas", "Castro", "Morales", "Silva", "Ortiz", "Paredes"];
    const departamentos = ["IT", "Ventas", "Marketing", "RRHH", "Desarrollo", "QA", "Finanzas"];

    const randomNombre = nombres[Math.floor(Math.random() * nombres.length)];
    const randomApellido = apellidos[Math.floor(Math.random() * apellidos.length)];
    const randomDept = departamentos[Math.floor(Math.random() * departamentos.length)];
    const randomCiudad = ciudadesDisponibles[Math.floor(Math.random() * ciudadesDisponibles.length)];
    const randomSalario = Math.floor(Math.random() * 50000) + 40000;

    const randomYear = 2018 + Math.floor(Math.random() * 7);
    const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const randomDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

    const newEmployee = {
      id: Date.now(),
      nombre: `${randomNombre} ${randomApellido}`,
      departamento: randomDept,
      salario: randomSalario,
      ciudad: randomCiudad,
      fechaIngreso: `${randomYear}-${randomMonth}-${randomDay}`,
      activo: Math.random() > 0.2,
    };

    gridie.addRow(newEmployee);
  });

  // Botón para limpiar todos los filtros
  document.getElementById("clearFiltersBtn")?.addEventListener("click", () => {
    gridie.setConfig(config as any);
  });

  // Botón de ejemplo práctico
  document.getElementById("exampleFilterBtn")?.addEventListener("click", () => {
    alert(`💡 Ejemplo Práctico: "Empleados IT con salario > $60,000"

🔹 PASO 1: Header Filter en Departamento
   • Haz clic en el embudo 🔽 del encabezado "Departamento"
   • Desmarca "Seleccionar todos"
   • Marca solo "IT"
   • Cierra el menú

🔹 PASO 2: Filter Row en Salario
   • En la fila de filtros debajo de "Salario"
   • Selecciona el operador ">" (mayor que)
   • Escribe "60000" en el input
   • Presiona Enter o haz clic fuera

✅ RESULTADO:
   Verás solo empleados que sean del departamento IT
   Y que además tengan salario mayor a $60,000

🎯 Ambos filtros deben cumplirse (AND).
   Puedes combinar cualquier filtro de Header y Row.

Pruébalo ahora! 🚀`);
  });

  new Sandbox("sandboxContainer", {
    files: [
      {
        fileName: "index.ts",
        code: tsCode,
        language: "typescript",
      },
      {
        fileName: "index.js",
        code: jsCode,
        language: "javascript",
      },
      {
        fileName: "index.html",
        code: htmlCode,
        language: "html",
      },
    ],
    activeFile: 0,
  });
}

export default render;