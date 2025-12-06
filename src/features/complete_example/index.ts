import { Sandbox } from "../../components/sandbox/sandbox";
import { Gridie } from "../../gridie/gridie";
import { typescriptCode, javascriptCode, htmlCode } from "./sources/sources";

// Generar datos de empleados realistas
function generateEmployeeData(count: number) {
  const departments = ["IT", "HR", "Sales", "Marketing", "Finance", "Development", "QA", "Support"];
  const cities = ["Santo Domingo", "Santiago", "La Vega", "San Pedro de Macorís", "Puerto Plata", "La Romana", "Higüey"];
  const firstNames = ["Juan", "María", "Carlos", "Ana", "Pedro", "Laura", "Miguel", "Isabel", "Roberto", "Carmen", "Luis", "Patricia", "José", "Rosa", "Manuel"];
  const lastNames = ["Pérez", "García", "López", "Martínez", "Rodríguez", "Fernández", "Sánchez", "Torres", "Gómez", "Díaz", "Ramírez", "Cruz", "Flores", "Reyes"];
  
  const data = [];

  for (let i = 1; i <= count; i++) {
    const year = 2018 + Math.floor(Math.random() * 7); // 2018-2024
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    data.push({
      employeeId: `EMP${String(i).padStart(4, '0')}`, // EMP0001, EMP0002, etc.
      fullName: `${firstName} ${lastName}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      salary: Math.floor(Math.random() * 60000) + 30000, // $30k - $90k
      city: cities[Math.floor(Math.random() * cities.length)],
      hireDate: `${year}-${month}-${day}`,
      age: Math.floor(Math.random() * 35) + 25, // 25-59 años
      active: Math.random() > 0.15, // 85% activos
      performance: Math.floor(Math.random() * 5) + 1, // 1-5 estrellas
    });
  }

  return data;
}

export function render(container: HTMLElement): void {
  container.innerHTML = `
    <div class="feature-layout">
      <!-- Demo Window -->
      <div class="demo-window">
        <div class="window-header">
          <span class="window-title">🎯 Complete Example - Gridie v1.0</span>
        </div>
        <div class="window-content">
          <h3>🚀 Demo Completo: Todas las Funcionalidades</h3>
          <p>Este ejemplo demuestra <strong>todas las capacidades</strong> de Gridie v1.0 en una sola tabla:</p>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="padding: 12px; background: white; border-radius: 6px; border-left: 4px solid #667eea;">
              <strong style="color: #667eea;">🔢 Paginación</strong>
              <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #666;">Control completo con 500 registros</p>
            </div>
            <div style="padding: 12px; background: white; border-radius: 6px; border-left: 4px solid #f59e0b;">
              <strong style="color: #f59e0b;">🔍 Filtros Avanzados</strong>
              <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #666;">Header Filter + Filter Row</p>
            </div>
            <div style="padding: 12px; background: white; border-radius: 6px; border-left: 4px solid #10b981;">
              <strong style="color: #10b981;">↕️ Multi-Sort</strong>
              <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #666;">Click + Shift para múltiples columnas</p>
            </div>
            <div style="padding: 12px; background: white; border-radius: 6px; border-left: 4px solid #ef4444;">
              <strong style="color: #ef4444;">⚙️ Acciones Custom</strong>
              <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #666;">Botones con HTML + eventos</p>
            </div>
            <div style="padding: 12px; background: white; border-radius: 6px; border-left: 4px solid #8b5cf6;">
              <strong style="color: #8b5cf6;">🆔 Identity Field</strong>
              <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #666;">CRUD con validación única</p>
            </div>
            <div style="padding: 12px; background: white; border-radius: 6px; border-left: 4px solid #06b6d4;">
              <strong style="color: #06b6d4;">🌍 i18n</strong>
              <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #666;">Español + Inglés integrado</p>
            </div>
          </div>

          <div class="demo-section">
            <h4>📊 Tabla de Empleados (500 registros)</h4>
            
            <!-- Controles de Demo -->
            <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
              <button id="addEmployeeBtn" class="demo-button">➕ Agregar Empleado</button>
              <button id="filterITBtn" class="demo-button">🖥️ Filtrar IT</button>
              <button id="filterSalaryBtn" class="demo-button">💰 Salario > $60k</button>
              <button id="sortBySalaryBtn" class="demo-button">📈 Ordenar por Salario</button>
              <button id="clearFiltersBtn" class="demo-button secondary">🗑️ Limpiar Filtros</button>
              <button id="toggleLangBtn" class="demo-button secondary">🌐 English/Español</button>
            </div>

            <!-- Panel de Estado -->
            <div style="padding: 15px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
              <h5 style="margin: 0 0 10px 0;">📊 Estado en Tiempo Real:</h5>
              <div id="statsPanel" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; font-family: monospace; font-size: 0.9em;">
                <div>Total: <strong id="statTotal">500</strong></div>
                <div>Filtrados: <strong id="statFiltered">500</strong></div>
                <div>Página: <strong id="statPage">1</strong>/<strong id="statTotalPages">50</strong></div>
                <div>Mostrando: <strong id="statShowing">1-10</strong></div>
                <div>Activos: <strong id="statActive">425</strong></div>
                <div>Inactivos: <strong id="statInactive">75</strong></div>
              </div>
            </div>

            <!-- Tabla -->
            <div id="employeeTable"></div>

            <!-- Log de Acciones -->
            <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; max-height: 200px; overflow-y: auto;">
              <h5 style="margin: 0 0 10px 0;">📝 Log de Acciones:</h5>
              <div id="actionLog" style="font-family: monospace; font-size: 0.85em; color: #666;">
                <div>✅ Tabla inicializada con 500 empleados</div>
              </div>
            </div>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
            <h4 style="margin: 0 0 15px 0;">💡 Características Demostradas:</h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <h5>🔍 Filtros (8 tipos de columnas):</h5>
                <ul style="margin: 5px 0 0 20px; line-height: 1.8; font-size: 0.9em;">
                  <li><strong>ID Empleado:</strong> string con búsqueda</li>
                  <li><strong>Nombre:</strong> Header Filter + Filter Row</li>
                  <li><strong>Departamento:</strong> Valores únicos con conteo</li>
                  <li><strong>Salario:</strong> Rangos numéricos + between</li>
                  <li><strong>Ciudad:</strong> Multi-selección</li>
                  <li><strong>Fecha:</strong> Jerarquía Año→Mes→Día</li>
                  <li><strong>Edad:</strong> Operadores numéricos</li>
                  <li><strong>Activo:</strong> Boolean (Sí/No)</li>
                  <li><strong>Rendimiento:</strong> Sistema de estrellas</li>
                </ul>
              </div>
              
              <div>
                <h5>⚙️ Funcionalidades:</h5>
                <ul style="margin: 5px 0 0 20px; line-height: 1.8; font-size: 0.9em;">
                  <li><strong>Identity Field:</strong> employeeId único</li>
                  <li><strong>CRUD Operations:</strong> Ver, Editar, Eliminar</li>
                  <li><strong>Validación:</strong> No duplicar IDs</li>
                  <li><strong>Multi-Sort:</strong> Shift + Click en headers</li>
                  <li><strong>Paginación:</strong> 10/25/50/100 items</li>
                  <li><strong>Jump to Page:</strong> Ir a página específica</li>
                  <li><strong>Info Display:</strong> Mostrando X-Y de Z</li>
                  <li><strong>Responsive:</strong> Mobile-friendly</li>
                  <li><strong>i18n:</strong> Cambio de idioma dinámico</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Code Sandbox -->
      <div id="sandboxContainer"></div>
    </div>
  `;

  // ========== GENERAR DATOS ==========
  const initialData = generateEmployeeData(500);
  let currentLanguage: "es" | "en" = "es";

  // ========== CREAR TABLA ==========
  const gridie = new Gridie({
    id: "complete-example-table",
    identityField: "employeeId", // ✅ Campo único para CRUD
    headers: [
      {
        label: "ID Empleado",
        type: "string",
        sortable: true,
        width: "120px",
        filters: {
          headerFilter: {
            visible: true,
            search: true,
            showCount: true,
          },
          filterRow: {
            visible: true,
            operators: ["contains", "equals", "startswith"],
          },
        },
      },
      {
        label: "Nombre Completo",
        type: "string",
        sortable: true,
        filters: {
          headerFilter: {
            visible: true,
            search: true,
            showCount: true,
          },
          filterRow: {
            visible: true,
            operators: ["contains", "equals", "startswith", "endswith"],
          },
        },
      },
      {
        label: "Departamento",
        type: "string",
        sortable: true,
        width: "140px",
        filters: {
          headerFilter: {
            visible: true,
            showCount: true,
          },
          filterRow: {
            visible: true,
          },
        },
      },
      {
        label: "Salario",
        type: "number",
        sortable: true,
        width: "120px",
        filters: {
          headerFilter: {
            visible: true,
            parameters: [
              { text: "🟢 Entry ($30k-$45k)", operator: "between", value: 30000, value2: 45000 },
              { text: "🟡 Mid ($45k-$65k)", operator: "between", value: 45000, value2: 65000 },
              { text: "🔴 Senior ($65k+)", operator: ">=", value: 65000 },
              { text: "⭐ Top 10% ($80k+)", operator: ">=", value: 80000 },
            ],
          },
          filterRow: {
            visible: true,
            operators: ["=", "<>", "<", ">", "<=", ">=", "between"],
          },
        },
      },
      {
        label: "Ciudad",
        type: "string",
        width: "150px",
        filters: {
          headerFilter: {
            visible: true,
            showCount: true,
          },
          filterRow: {
            visible: true,
          },
        },
      },
      {
        label: "Fecha Ingreso",
        type: "date",
        sortable: true,
        width: "130px",
        filters: {
          headerFilter: {
            visible: true,
            dateHierarchy: ["year", "month", "day"],
          },
          filterRow: {
            visible: true,
            operators: ["=", "<>", "<", ">", "<=", ">=", "between"],
          },
        },
      },
      {
        label: "Edad",
        type: "number",
        sortable: true,
        width: "80px",
        filters: {
          filterRow: {
            visible: true,
            operators: ["=", "<>", "<", ">", "<=", ">=", "between"],
          },
        },
      },
      {
        label: "Activo",
        type: "boolean",
        width: "90px",
        filters: {
          headerFilter: {
            visible: true,
          },
          filterRow: {
            visible: true,
          },
        },
      },
      {
        label: "Rendimiento",
        type: "number",
        width: "130px",
      },
      "Acciones", // Columna de acciones HTML
    ],
    body: initialData.map(emp => ({
      ...emp,
      salary: emp.salary, // Mantener como número
      performance: "⭐".repeat(emp.performance), // Convertir a estrellas
      actions: [ // ✅ Array de acciones HTML
        {
          content: '<button style="padding: 6px 10px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 4px;" title="Ver detalles">👁️</button>',
          event: "click",
          funct: (row: any) => {
            logAction(`Ver empleado: ${row.fullName} (${row.employeeId})`);
            alert(`👤 Empleado: ${row.fullName}\n🆔 ID: ${row.employeeId}\n🏢 Depto: ${row.department}\n💰 Salario: $${row.salary.toLocaleString()}\n🌍 Ciudad: ${row.city}\n📅 Ingreso: ${row.hireDate}\n🎂 Edad: ${row.age}\n⭐ Rendimiento: ${row.performance}\n✅ Activo: ${row.active ? "Sí" : "No"}`);
          },
        },
        {
          content: '<button style="padding: 6px 10px; background: #f59e0b; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 4px;" title="Editar">✏️</button>',
          event: "click",
          funct: (row: any) => {
            const newSalary = prompt(`Editar salario de ${row.fullName}:`, String(row.salary));
            if (newSalary && !isNaN(Number(newSalary))) {
              const updated = gridie.updateRowByIdentity(row.employeeId, {
                salary: Number(newSalary)
              });
              if (updated) {
                logAction(`✏️ Salario actualizado: ${row.fullName} → $${Number(newSalary).toLocaleString()}`);
                updateStats();
              }
            }
          },
        },
        {
          content: '<button style="padding: 6px 10px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;" title="Eliminar">🗑️</button>',
          event: "click",
          funct: (row: any) => {
            if (confirm(`¿Eliminar a ${row.fullName}?`)) {
              const removed = gridie.removeRowByIdentity(row.employeeId);
              if (removed) {
                logAction(`🗑️ Empleado eliminado: ${row.fullName} (${row.employeeId})`);
                updateStats();
              }
            }
          },
        },
      ],
    })),
    enableSort: true,
    enableFilter: true,
    language: "es",
    paging: {
      enabled: true,
      pageSize: {
        visible: true,
        default: 10,
        options: [10, 25, 50, 100],
      },
      showInfo: true,
      navigation: {
        visible: true,
        showPrevNext: true,
        showFirstLast: true,
        maxButtons: 7,
        jumpTo: {
          visible: true,
          position: "inline",
          buttonText: "→",
        },
      },
      position: "bottom",
    },
  });

  container.querySelector("#employeeTable")?.appendChild(gridie);

  // ========== FUNCIONES DE UTILIDAD ==========
  
  function logAction(message: string) {
    const log = container.querySelector("#actionLog");
    if (log) {
      const timestamp = new Date().toLocaleTimeString();
      const entry = document.createElement("div");
      entry.textContent = `[${timestamp}] ${message}`;
      entry.style.marginTop = "5px";
      log.insertBefore(entry, log.firstChild);
      
      // Mantener máximo 10 mensajes
      while (log.children.length > 10) {
        log.removeChild(log.lastChild!);
      }
    }
  }

  function updateStats() {
    const total = 500; // Original
    const filtered = gridie.getTotalItems();
    const page = gridie.getCurrentPage();
    const totalPages = gridie.getTotalPages();
    const pageSize = gridie.getPageSize();
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, filtered);

    // Contar activos/inactivos del body filtrado
    const currentBody = gridie.getBody();
    const active = currentBody.filter((row: any) => row.active === true).length;
    const inactive = currentBody.filter((row: any) => row.active === false).length;

    container.querySelector("#statTotal")!.textContent = String(total);
    container.querySelector("#statFiltered")!.textContent = String(filtered);
    container.querySelector("#statPage")!.textContent = String(page);
    container.querySelector("#statTotalPages")!.textContent = String(totalPages);
    container.querySelector("#statShowing")!.textContent = `${start}-${end}`;
    container.querySelector("#statActive")!.textContent = String(active);
    container.querySelector("#statInactive")!.textContent = String(inactive);
  }

  // Actualizar stats inicialmente
  updateStats();

  // Escuchar cambios de página
  gridie.addEventListener("pagechange", () => {
    updateStats();
    logAction(`📄 Navegado a página ${gridie.getCurrentPage()}`);
  });

  // ========== BOTONES DE DEMO ==========

  // Agregar empleado
  container.querySelector("#addEmployeeBtn")?.addEventListener("click", () => {
    const newId = `EMP${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`;
    const newEmployee = {
      employeeId: newId,
      fullName: "Nuevo Empleado",
      department: "IT",
      salary: 50000,
      city: "Santo Domingo",
      hireDate: new Date().toISOString().split('T')[0],
      age: 30,
      active: true,
      performance: "⭐⭐⭐⭐",
      actions: [
        {
          content: '<button style="padding: 6px 10px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 4px;">👁️</button>',
          event: "click",
          funct: (row: any) => {
            alert(`Ver: ${row.fullName}`);
          },
        },
        {
          content: '<button style="padding: 6px 10px; background: #f59e0b; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 4px;">✏️</button>',
          event: "click",
          funct: (row: any) => {
            const newSalary = prompt("Nuevo salario:", String(row.salary));
            if (newSalary) {
              gridie.updateRowByIdentity(row.employeeId, { salary: Number(newSalary) });
              updateStats();
            }
          },
        },
        {
          content: '<button style="padding: 6px 10px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">🗑️</button>',
          event: "click",
          funct: (row: any) => {
            if (confirm("¿Eliminar?")) {
              gridie.removeRowByIdentity(row.employeeId);
              updateStats();
            }
          },
        },
      ],
    };

    const added = gridie.addRow(newEmployee);
    if (added) {
      logAction(`➕ Empleado agregado: ${newEmployee.fullName} (${newId})`);
      updateStats();
    } else {
      alert("❌ Error: ID duplicado");
      logAction(`❌ No se pudo agregar: ID duplicado`);
    }
  });

  // Filtrar IT
  container.querySelector("#filterITBtn")?.addEventListener("click", () => {
    alert(`💡 Para filtrar solo IT:\n\n1. Haz clic en el embudo (🔽) de "Departamento"\n2. Desmarca "Seleccionar todos"\n3. Marca solo "IT"\n4. Observa cómo cambia el total`);
    logAction(`🔍 Sugerencia: Filtrar departamento IT`);
  });

  // Filtrar salario > $60k
  container.querySelector("#filterSalaryBtn")?.addEventListener("click", () => {
    alert(`💡 Para filtrar salario > $60k:\n\n1. En la fila de filtros bajo "Salario"\n2. Haz clic en el icono del operador\n3. Selecciona ">" (mayor que)\n4. Escribe "60000"\n5. Presiona Enter`);
    logAction(`🔍 Sugerencia: Filtrar salario > $60,000`);
  });

  // Ordenar por salario
  container.querySelector("#sortBySalaryBtn")?.addEventListener("click", () => {
    alert(`💡 Para ordenar por salario:\n\n1. Haz clic en el header "Salario" para ordenar ascendente\n2. Haz clic nuevamente para ordenar descendente\n3. Clic derecho para más opciones\n\n🎯 Multi-Sort: Mantén Shift y haz clic en otras columnas para ordenamiento múltiple`);
    logAction(`↕️ Sugerencia: Ordenar por salario`);
  });

  // Limpiar filtros
  container.querySelector("#clearFiltersBtn")?.addEventListener("click", () => {
    gridie.clearAllFilters();
    logAction(`🗑️ Todos los filtros limpiados`);
    updateStats();
  });

  // Cambiar idioma
  container.querySelector("#toggleLangBtn")?.addEventListener("click", () => {
    currentLanguage = currentLanguage === "es" ? "en" : "es";
    gridie.setConfig({
      ...gridie["_config"],
      language: currentLanguage,
    } as any);
    logAction(`🌐 Idioma cambiado a: ${currentLanguage === "es" ? "Español" : "English"}`);
  });

  // ========== SANDBOX ==========
  new Sandbox("sandboxContainer", {
    files: [
      {
        fileName: "index.ts",
        code: typescriptCode,
        language: "typescript",
      },
      {
        fileName: "index.js",
        code: javascriptCode,
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