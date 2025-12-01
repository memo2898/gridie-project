// src/features/2_Filtering/header_filter/index.ts
import { Sandbox } from "../../../components/sandbox/sandbox";
import { Gridie } from "../../../gridie/gridie";
import { tsCode, jsCode, htmlCode } from "./sources/sources";

export function render(container: HTMLElement): void {
  container.innerHTML = `
    <div class="feature-layout">
      <!-- Demo Window -->
      <div class="demo-window">
        <div class="window-header">
          <span class="window-title">Demo - Header Filter (Filtro de Encabezado)</span>
        </div>
        <div class="window-content">
          <h3>Filtrado por Checkboxes en Encabezados</h3>
          <p>El Header Filter permite filtrar datos seleccionando valores mediante checkboxes en un menú desplegable que aparece al hacer clic en el icono de embudo en el encabezado de cada columna.</p>
          
          <div class="demo-section">
            <h4>Características Principales</h4>
            <ul style="list-style: disc; margin-left: 20px; line-height: 1.8;">
              <li><strong>Valores únicos automáticos:</strong> Sin configuración adicional, extrae y muestra todos los valores únicos de la columna</li>
              <li><strong>Selección múltiple:</strong> Checkboxes para seleccionar uno o varios valores simultáneamente</li>
              <li><strong>"Seleccionar todos":</strong> Checkbox master con tres estados (checked, unchecked, indeterminate)</li>
              <li><strong>Contador de registros:</strong> Muestra cuántos registros tiene cada valor entre paréntesis</li>
              <li><strong>Búsqueda interna:</strong> Campo de búsqueda dentro del menú para filtrar opciones visualmente</li>
              <li><strong>Parameters personalizados:</strong> Crea grupos lógicos con operadores (rangos, listas, etc.)</li>
              <li><strong>Values desde BD/API:</strong> Provee una lista de valores predefinida en lugar de extraerlos automáticamente</li>
              <li><strong>Jerarquías de fechas:</strong> Navegación expandible por año → mes → día → hora</li>
              <li><strong>Combina con Filter Row:</strong> Ambos filtros trabajan juntos con lógica AND</li>
            </ul>

            <div style="margin-top: 20px; padding: 15px; background: #fff4e6; border-radius: 8px; border-left: 4px solid #ff9800;">
              <h5 style="margin-top: 0;">📋 Casos de Uso Implementados:</h5>
              <div style="font-size: 0.9em; line-height: 1.7;">
                <details open>
                  <summary style="cursor: pointer; font-weight: 600; margin-bottom: 10px;">🔹 Casos Básicos (1-7)</summary>
                  <div style="margin-left: 20px;">
                    <p><strong>Caso 1 - ID:</strong> Columna sin Header Filter</p>
                    <p><strong>Caso 2 - Nombre:</strong> Valores únicos automáticos + búsqueda interna + sin contador</p>
                    <p><strong>Caso 3 - Email:</strong> Valores únicos automáticos con contador</p>
                    <p><strong>Caso 4 - Departamento:</strong> Parameters + Values combinados con separador</p>
                    <p><strong>Caso 5 - Salario:</strong> Solo parameters con rangos usando operadores &lt;, between, &gt;=</p>
                    <p><strong>Caso 6 - Ciudad:</strong> Values desde BD/API</p>
                    <p><strong>Caso 7 - Activo:</strong> Boolean con valores Sí/No</p>
                  </div>
                </details>

                <details open style="margin-top: 15px;">
                  <summary style="cursor: pointer; font-weight: 600; margin-bottom: 10px;">🔹 Casos con Fechas (8-13)</summary>
                  <div style="margin-left: 20px;">
                    <p><strong>Caso 8 - Fecha Ingreso (Año):</strong> Jerarquía solo año → 2024 (8), 2023 (5)</p>
                    <p><strong>Caso 9 - Fecha Nacimiento (Año→Mes):</strong> Expandible → 1990 → Enero (2), Febrero (1)</p>
                    <p><strong>Caso 10 - Última Conexión (Año→Mes→Día):</strong> Jerarquía completa de fechas</p>
                    <p><strong>Caso 11 - Fecha con Parameters:</strong> Opciones personalizadas + jerarquía (Este año, Últimos 30 días, Q1 2024)</p>
                    <p><strong>Caso 12 - DateTime 12h:</strong> Jerarquía con horas en formato 12h (09:00 AM, 02:30 PM)</p>
                    <p><strong>Caso 13 - DateTime 24h:</strong> Jerarquía con horas en formato 24h (09:00, 14:30)</p>
                  </div>
                </details>

                <details open style="margin-top: 15px;">
                  <summary style="cursor: pointer; font-weight: 600; margin-bottom: 10px;">🔹 Caso Combinado (17)</summary>
                  <div style="margin-left: 20px;">
                    <p><strong>Caso 17 - Salario:</strong> Header Filter + Filter Row combinados con lógica AND</p>
                  </div>
                </details>
              </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #f0f7ff; border-radius: 8px; border-left: 4px solid #667eea;">
              <h5 style="margin-top: 0;">💡 Configuración por Tipo:</h5>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; font-size: 0.9em;">
                <div>
                  <strong>1️⃣ Sin configuración:</strong>
                  <pre style="background: #fff; padding: 8px; border-radius: 4px; margin-top: 5px; overflow-x: auto;"><code>headerFilter: { 
  visible: true 
}</code></pre>
                  <small>→ Extrae valores únicos automáticamente</small>
                </div>
                
                <div>
                  <strong>2️⃣ Con values (desde BD):</strong>
                  <pre style="background: #fff; padding: 8px; border-radius: 4px; margin-top: 5px; overflow-x: auto;"><code>headerFilter: {
  visible: true,
  values: ["SD", "STI", "LV"]
}</code></pre>
                  <small>→ Lista predefinida de valores</small>
                </div>
                
                <div>
                  <strong>3️⃣ Con parameters:</strong>
                  <pre style="background: #fff; padding: 8px; border-radius: 4px; margin-top: 5px; overflow-x: auto;"><code>headerFilter: {
  visible: true,
  parameters: [{
    text: "Senior ($65k+)",
    operator: ">=",
    value: 65000
  }]
}</code></pre>
                  <small>→ Opciones con operadores lógicos</small>
                </div>
                
                <div>
                  <strong>4️⃣ Jerarquía de fechas:</strong>
                  <pre style="background: #fff; padding: 8px; border-radius: 4px; margin-top: 5px; overflow-x: auto;"><code>headerFilter: {
  visible: true,
  dateHierarchy: ["year", "month", "day"]
}</code></pre>
                  <small>→ Navegación expandible por fechas</small>
                </div>
              </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #f3e5f5; border-radius: 8px; border-left: 4px solid #9c27b0;">
              <h5 style="margin-top: 0;">🎯 Operadores Disponibles:</h5>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 0.9em;">
                <div>
                  <strong>Comparación:</strong><br/>
                  <code>=</code>, <code>&lt;&gt;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>
                </div>
                <div>
                  <strong>Rangos:</strong><br/>
                  <code>between</code> (value + value2)
                </div>
                <div>
                  <strong>Listas:</strong><br/>
                  <code>in</code> (value como array)
                </div>
                <div>
                  <strong>Fechas especiales:</strong><br/>
                  <code>today</code>, <code>yesterday</code>, <code>thisWeek</code>, <code>thisMonth</code>, <code>thisYear</code>, <code>last</code>, <code>year</code>, <code>month</code>
                </div>
              </div>
            </div>

            <div style="margin-top: 20px;">
              <button id="addEmployeeBtn" class="demo-button">Agregar Empleado</button>
              <button id="clearFiltersBtn" class="demo-button secondary">Limpiar Todos los Filtros</button>
              <button id="filterTechSeniorBtn" class="demo-button">Ver Ejemplo: Técnicos + Senior</button>
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

  // Simular valores desde "BD"
  const ciudadesDesdeDB = ["Santo Domingo", "Santiago", "La Vega", "San Pedro"];

  const config = {
    id: "tabla-header-filter-completo",
    headers: [
      // CASO 1: Sin Header Filter
      {
        label: "ID",
        type: "number" as const,
        sortable: true,
      },
      
      // CASO 2: Valores únicos automáticos + búsqueda + sin contador
      {
        label: "Nombre",
        type: "string" as const,
        sortable: true,
        filters: {
          headerFilter: {
            visible: true,
            search: true,
            showCount: false,
          },
        },
      },
      
      // CASO 3: Valores únicos automáticos con contador
      {
        label: "Email",
        type: "string" as const,
        filters: {
          headerFilter: {
            visible: true,
          },
        },
      },
      
      // CASO 4: Parameters + Values combinados
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
        },
      },
      
      // CASO 5: Solo Parameters con rangos + CASO 17: Combinado con Filter Row
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
                text: "Other (>$52k)",
                operator: ">" as const,
                value: 52000,
              },
            ],
          },
        },
      },
      
      // CASO 6: Values desde "BD"
      {
        label: "Ciudad",
        type: "string" as const,
        filters: {
          headerFilter: {
            visible: true,
            values: ciudadesDesdeDB,
          },
        },
      },
      
      // CASO 7: Boolean automático
      {
        label: "Activo",
        type: "boolean" as const,
        filters: {
          headerFilter: {
            visible: true,
          },
        },
      },

      // ✅ CASO 8: Fecha con jerarquía solo año
      {
        label: "Fecha Ingreso",
        type: "date" as const,
        sortable: true,
        filters: {
          headerFilter: {
            visible: true,
            dateHierarchy: ["year"] as const,
          },
        },
      },

      // ✅ CASO 9: Fecha con jerarquía año → mes
      {
        label: "Fecha Nacimiento",
        type: "date" as const,
        filters: {
          headerFilter: {
            visible: true,
            dateHierarchy: ["year", "month"] as const,
          },
        },
      },

      // ✅ CASO 10: Fecha con jerarquía año → mes → día
      {
        label: "Última Conexión",
        type: "date" as const,
        filters: {
          headerFilter: {
            visible: true,
            dateHierarchy: ["year", "month", "day"] as const,
          },
        },
      },

      // ✅ CASO 11: Fecha con parameters + jerarquía
      {
        label: "Fecha Proyecto",
        type: "date" as const,
        filters: {
          headerFilter: {
            visible: true,
            parameters: [
              {
                text: "📅 Este año (2024)",
                operator: "year" as const,
                value: 2024,
              },
              {
                text: "📆 Últimos 30 días",
                operator: "last" as const,
                value: 30,
                unit: "days" as const,
              },
              {
                text: "🗓️ Q1 2024",
                operator: "between" as const,
                value: "2024-01-01",
                value2: "2024-03-31",
              },
            ],
            dateHierarchy: ["year", "month"] as const,
          },
        },
      },

      // ✅ CASO 12: DateTime con formato 12h
      {
        label: "Hora Registro (12h)",
        type: "date" as const,
        filters: {
          headerFilter: {
            visible: true,
            dateHierarchy: ["year", "month", "day", "hour"] as const,
           // timeFormat: "12h" as const,
          },
        },
      },

      // ✅ CASO 13: DateTime con formato 24h
      {
        label: "Hora Salida (24h)",
        type: "date" as const,
        filters: {
          headerFilter: {
            visible: true,
            dateHierarchy: ["year", "month", "day", "hour"] as const,
            //timeFormat: "24h" as const,
            
          },
        },
      },
    ],
    body: [
      { 
        id: 1, nombre: "Juan Pérez", email: "juan@empresa.com", departamento: "IT", salario: 45000, 
        ciudad: "Santo Domingo", activo: true, fechaIngreso: "2020-03-15", fechaNacimiento: "1990-05-12",
        ultimaConexion: "2024-01-15", fechaProyecto: "2024-02-20", 
        horaRegistro: "2024-03-15T09:30:00", horaSalida: "2024-03-15T17:45:00"
      },
      { 
        id: 2, nombre: "María García", email: "maria@empresa.com", departamento: "Ventas", salario: 52000, 
        ciudad: "Santiago", activo: true, fechaIngreso: "2019-07-22", fechaNacimiento: "1988-11-03",
        ultimaConexion: "2024-01-20", fechaProyecto: "2024-01-10",
        horaRegistro: "2024-03-15T08:15:00", horaSalida: "2024-03-15T16:30:00"
      },
      // { 
      //   id: 3, nombre: "Carlos López", email: "carlos@empresa.com", departamento: "IT", salario: 48000, 
      //   ciudad: "La Vega", activo: true, fechaIngreso: "2021-01-10", fechaNacimiento: "1992-02-28",
      //   ultimaConexion: "2024-02-05", fechaProyecto: "2024-03-15",
      //   horaRegistro: "2024-03-15T10:00:00", horaSalida: "2024-03-15T18:15:00"
      // },
      { 
        id: 4, nombre: "Ana Martínez", email: "ana@empresa.com", departamento: "Marketing", salario: 55000, 
        ciudad: "Santo Domingo", activo: false, fechaIngreso: "2018-11-05", fechaNacimiento: "1985-07-19",
        ultimaConexion: "2023-12-20", fechaProyecto: "2023-11-05",
        horaRegistro: "2024-03-15T14:20:00", horaSalida: "2024-03-15T22:45:00"
      },
      // { 
      //   id: 5, nombre: "Pedro Rodríguez", email: "pedro@empresa.com", departamento: "RRHH", salario: 50000, 
      //   ciudad: "San Pedro", activo: true, fechaIngreso: "2020-09-18", fechaNacimiento: "1991-04-15",
      //   ultimaConexion: "2024-02-28", fechaProyecto: "2024-02-01",
      //   horaRegistro: "2024-03-15T07:45:00", horaSalida: "2024-03-15T15:30:00"
      // },
      // { 
      //   id: 6, nombre: "Laura Fernández", email: "laura@empresa.com", departamento: "IT", salario: 68000, 
      //   ciudad: "Santo Domingo", activo: true, fechaIngreso: "2019-04-30", fechaNacimiento: "1987-10-08",
      //   ultimaConexion: "2024-03-01", fechaProyecto: "2024-01-25",
      //   horaRegistro: "2024-03-15T11:30:00", horaSalida: "2024-03-15T19:00:00"
      // },
      // { 
      //   id: 7, nombre: "Miguel Sánchez", email: "miguel@empresa.com", departamento: "Ventas", salario: 47000, 
      //   ciudad: "Santiago", activo: true, fechaIngreso: "2021-06-12", fechaNacimiento: "1993-01-22",
      //   ultimaConexion: "2024-02-10", fechaProyecto: "2024-02-28",
      //   horaRegistro: "2024-03-15T09:00:00", horaSalida: "2024-03-15T17:15:00"
      // },
      // { 
      //   id: 8, nombre: "Isabel Torres", email: "isabel@empresa.com", departamento: "Marketing", salario: 53000, 
      //   ciudad: "La Vega", activo: true, fechaIngreso: "2020-02-25", fechaNacimiento: "1989-06-30",
      //   ultimaConexion: "2024-01-18", fechaProyecto: "2023-12-10",
      //   horaRegistro: "2024-03-15T13:15:00", horaSalida: "2024-03-15T21:30:00"
      // },
      // { 
      //   id: 9, nombre: "Roberto Gómez", email: "roberto@empresa.com", departamento: "Desarrollo", salario: 72000, 
      //   ciudad: "Santo Domingo", activo: true, fechaIngreso: "2018-03-10", fechaNacimiento: "1986-09-14",
      //   ultimaConexion: "2024-03-05", fechaProyecto: "2024-03-01",
      //   horaRegistro: "2024-03-15T08:30:00", horaSalida: "2024-03-15T16:45:00"
      // },
      // { 
      //   id: 10, nombre: "Carmen Díaz", email: "carmen@empresa.com", departamento: "QA", salario: 58000, 
      //   ciudad: "Santiago", activo: false, fechaIngreso: "2019-08-15", fechaNacimiento: "1990-12-05",
      //   ultimaConexion: "2023-11-30", fechaProyecto: "2023-10-20",
      //   horaRegistro: "2024-03-15T15:00:00", horaSalida: "2024-03-15T23:15:00"
      // },
      // { 
      //   id: 11, nombre: "Francisco Ruiz", email: "francisco@empresa.com", departamento: "IT", salario: 44000, 
      //   ciudad: "La Vega", activo: true, fechaIngreso: "2022-01-08", fechaNacimiento: "1994-03-17",
      //   ultimaConexion: "2024-02-22", fechaProyecto: "2024-01-15",
      //   horaRegistro: "2024-03-15T10:45:00", horaSalida: "2024-03-15T18:30:00"
      // },
      // { 
      //   id: 12, nombre: "Patricia Moreno", email: "patricia@empresa.com", departamento: "Ventas", salario: 75000, 
      //   ciudad: "San Pedro", activo: true, fechaIngreso: "2020-05-20", fechaNacimiento: "1991-08-25",
      //   ultimaConexion: "2024-01-25", fechaProyecto: "2024-02-15",
      //   horaRegistro: "2024-03-15T09:15:00", horaSalida: "2024-03-15T17:00:00"
      // },
      // { 
      //   id: 13, nombre: "José Jiménez", email: "jose@empresa.com", departamento: "Finanzas", salario: 75000, 
      //   ciudad: "Santo Domingo", activo: true, fechaIngreso: "2017-12-01", fechaNacimiento: "1984-05-10",
      //   ultimaConexion: "2024-03-08", fechaProyecto: "2024-02-05",
      //   horaRegistro: "2024-03-15T08:00:00", horaSalida: "2024-03-15T16:15:00"
      // },
      // { 
      //   id: 14, nombre: "Lucía Álvarez", email: "lucia@empresa.com", departamento: "Marketing", salario: 49000, 
      //   ciudad: "Santiago", activo: true, fechaIngreso: "2021-03-14", fechaNacimiento: "1992-11-20",
      //   ultimaConexion: "2024-02-15", fechaProyecto: "2024-01-20",
      //   horaRegistro: "2024-03-15T12:30:00", horaSalida: "2024-03-15T20:45:00"
      // },
      // { 
      //   id: 15, nombre: "Antonio Ramírez", email: "antonio@empresa.com", departamento: "Desarrollo", salario: 71000, 
      //   ciudad: "Santo Domingo", activo: true, fechaIngreso: "2019-10-28", fechaNacimiento: "1988-02-14",
      //   ultimaConexion: "2024-03-10", fechaProyecto: "2024-03-08",
      //   horaRegistro: "2024-03-15T11:00:00", horaSalida: "2024-03-15T19:15:00"
      // },
      // { 
      //   id: 16, nombre: "Rosa Martín", email: "rosa@empresa.com", departamento: "IT", salario: 46000, 
      //   ciudad: "La Vega", activo: true, fechaIngreso: "2021-11-22", fechaNacimiento: "1993-07-08",
      //   ultimaConexion: "2024-01-30", fechaProyecto: "2023-12-20",
      //   horaRegistro: "2024-03-15T14:45:00", horaSalida: "2024-03-15T22:30:00"
      // },
      // { 
      //   id: 17, nombre: "Javier Castro", email: "javier@empresa.com", departamento: "QA", salario: 62000, 
      //   ciudad: "Santiago", activo: true, fechaIngreso: "2018-08-17", fechaNacimiento: "1987-04-02",
      //   ultimaConexion: "2024-02-18", fechaProyecto: "2024-02-10",
      //   horaRegistro: "2024-03-15T07:30:00", horaSalida: "2024-03-15T15:45:00"
      // },
      // { 
      //   id: 18, nombre: "Sofía Herrera", email: "sofia@empresa.com", departamento: "Ventas", salario: 54000, 
      //   ciudad: "San Pedro", activo: false, fechaIngreso: "2020-12-05", fechaNacimiento: "1990-09-16",
      //   ultimaConexion: "2023-10-15", fechaProyecto: "2023-09-30",
      //   horaRegistro: "2024-03-15T16:00:00", horaSalida: "2024-03-16T00:15:00"
      // },
      { 
        id: 2, nombre: "Manuel Maldonado", email: "manuel@empresa.com", departamento: "Ventas", salario: 53000, 
        ciudad: "Valverde", activo: true, fechaIngreso: "2019-07-22", fechaNacimiento: "1988-11-03",
        ultimaConexion: "2024-01-20", fechaProyecto: "2024-01-10",
        horaRegistro: "2024-03-15T08:15:00", horaSalida: "2024-03-15T16:30:00"
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
    const randomCiudad = ciudadesDesdeDB[Math.floor(Math.random() * ciudadesDesdeDB.length)];
    const randomSalario = Math.floor(Math.random() * 50000) + 40000;

    // Generar fechas aleatorias
    const randomYear = 2018 + Math.floor(Math.random() * 7);
    const randomMonth = Math.floor(Math.random() * 12);
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const randomHour = Math.floor(Math.random() * 24);
    const randomMinute = Math.floor(Math.random() * 60);

    const newEmployee = {
      id: Date.now(),
      nombre: `${randomNombre} ${randomApellido}`,
      email: `${randomNombre.toLowerCase()}.${randomApellido.toLowerCase()}@empresa.com`,
      departamento: randomDept,
      salario: randomSalario,
      ciudad: randomCiudad,
      activo: Math.random() > 0.2,
      fechaIngreso: `${randomYear}-${String(randomMonth + 1).padStart(2, '0')}-${String(randomDay).padStart(2, '0')}`,
      fechaNacimiento: `${1985 + Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      ultimaConexion: `2024-${String(Math.floor(Math.random() * 3) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      fechaProyecto: `${randomYear}-${String(randomMonth + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      horaRegistro: `2024-03-15T${String(randomHour).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}:00`,
      horaSalida: `2024-03-15T${String((randomHour + 8) % 24).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}:00`,
    };

    gridie.addRow(newEmployee);
  });

  // Botón para limpiar todos los filtros
  document.getElementById("clearFiltersBtn")?.addEventListener("click", () => {
    gridie.setConfig(config as any);
  });

  // Botón de ejemplo
  document.getElementById("filterTechSeniorBtn")?.addEventListener("click", () => {
    alert(`💡 Para ver empleados Técnicos con salario Senior:

1️⃣ Haz clic en el embudo 🔽 en "Departamento"
   → Selecciona "🖥️ Departamentos Técnicos"

2️⃣ Haz clic en el embudo 🔽 en "Salario"
   → Selecciona "Senior ($65k+)"

Para fechas jerárquicas, haz clic en las flechas ▶ para expandir niveles.

Los filtros se aplicarán automáticamente con lógica AND.`);
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