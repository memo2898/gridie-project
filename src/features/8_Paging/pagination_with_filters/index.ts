import { Sandbox } from "../../../components/sandbox/sandbox";
import { Gridie } from "../../../gridie/gridie";
import { typescriptCode, javascriptCode, htmlCode } from "./sources/sources";

function generateData(count: number) {
  const departments = ["IT", "HR", "Sales", "Marketing", "Finance", "Development", "QA"];
  const cities = ["Santo Domingo", "Santiago", "La Vega", "San Pedro", "Puerto Plata"];
  const names = ["Juan", "María", "Carlos", "Ana", "Pedro", "Laura", "Miguel", "Isabel", "Roberto", "Carmen"];
  const lastNames = ["Pérez", "García", "López", "Martínez", "Rodríguez", "Fernández", "Sánchez", "Torres", "Gómez", "Díaz"];
  
  const data = [];

  for (let i = 1; i <= count; i++) {
    const year = 2018 + Math.floor(Math.random() * 7);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

    data.push({
      id: i,
      name: `${names[Math.floor(Math.random() * names.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      salary: Math.floor(Math.random() * 50000) + 35000,
      city: cities[Math.floor(Math.random() * cities.length)],
      hireDate: `${year}-${month}-${day}`,
      age: Math.floor(Math.random() * 35) + 25,
      active: Math.random() > 0.2,
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
          <span class="window-title">Demo - Paginación con Filtros</span>
        </div>
        <div class="window-content">
          <h3>Paginación + Filtros Avanzados</h3>
          <p>Gridie combina <strong>paginación automática</strong> con <strong>filtros dinámicos</strong> (Header Filter + Filter Row). Los filtros se aplican <strong>antes</strong> de paginar, y la paginación se recalcula automáticamente según los resultados filtrados.</p>
          
          <div class="demo-section">
            <h4>¿Cómo Funciona la Integración?</h4>
            <ul style="list-style: disc; margin-left: 20px; line-height: 1.8;">
              <li><strong>Filtrado Primero:</strong> Los filtros se aplican a todos los datos originales (100 empleados)</li>
              <li><strong>Paginación Después:</strong> Los resultados filtrados se dividen en páginas automáticamente</li>
              <li><strong>Reseteo Automático:</strong> Al aplicar un filtro, la tabla vuelve a la página 1</li>
              <li><strong>Recálculo Dinámico:</strong> El total de páginas se actualiza según los resultados filtrados</li>
              <li><strong>Info en Tiempo Real:</strong> El footer muestra "Mostrando X-Y de Z items" con Z = items filtrados</li>
            </ul>

            <div style="margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 8px; border-left: 4px solid #4caf50;">
              <h5 style="margin-top: 0;">✅ Flujo de Funcionamiento:</h5>
              <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
                <li><strong>Paso 1:</strong> Usuario aplica filtros (Header Filter o Filter Row)</li>
                <li><strong>Paso 2:</strong> Gridie filtra los 100 empleados → Resultado: ej. 15 empleados</li>
                <li><strong>Paso 3:</strong> Gridie resetea a página 1 automáticamente</li>
                <li><strong>Paso 4:</strong> Gridie recalcula: 15 items ÷ 10 por página = 2 páginas totales</li>
                <li><strong>Paso 5:</strong> Footer se actualiza: "Mostrando 1-10 de 15 items"</li>
                <li><strong>Paso 6:</strong> Botones de navegación se habilitan/deshabilitan según el nuevo total</li>
              </ol>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #fff3e0; border-radius: 8px; border-left: 4px solid #ff9800;">
              <h5 style="margin-top: 0;">💡 Ejemplo Práctico:</h5>
              <div style="background: #fff; padding: 12px; border-radius: 6px; margin-top: 10px;">
                <p style="margin: 0 0 10px 0; font-weight: 600;">Escenario: "Empleados del Departamento IT con salario > $60,000"</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
                  <div>
                    <strong>📊 Antes del Filtro:</strong>
                    <ul style="margin: 5px 0 0 20px; font-size: 0.9em; color: #666;">
                      <li>Total: 100 empleados</li>
                      <li>Páginas: 10 (10 por página)</li>
                      <li>Mostrando: 1-10 de 100</li>
                    </ul>
                  </div>
                  <div>
                    <strong>📊 Después del Filtro:</strong>
                    <ul style="margin: 5px 0 0 20px; font-size: 0.9em; color: #666;">
                      <li>Total: 8 empleados (filtrados)</li>
                      <li>Páginas: 1 (8 items caben en 1 página)</li>
                      <li>Mostrando: 1-8 de 8</li>
                    </ul>
                  </div>
                </div>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 0.9em;">
                  <strong>Resultado:</strong> Los botones "Siguiente" y "Última" se deshabilitan automáticamente porque solo hay 1 página.
                </p>
              </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #f3e5f5; border-radius: 8px; border-left: 4px solid #9c27b0;">
              <h5 style="margin-top: 0;">🎯 Columnas Configuradas:</h5>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 0.9em; margin-top: 10px;">
                <div style="background: #fff; padding: 8px; border-radius: 6px;">
                  <strong>👤 Nombre</strong>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 0.85em;">Header Filter (búsqueda) + Filter Row (contains, equals)</p>
                </div>
                <div style="background: #fff; padding: 8px; border-radius: 6px;">
                  <strong>🏢 Departamento</strong>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 0.85em;">Header Filter (valores únicos) + Filter Row (operadores string)</p>
                </div>
                <div style="background: #fff; padding: 8px; border-radius: 6px;">
                  <strong>💰 Salario</strong>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 0.85em;">Header Filter (rangos) + Filter Row (operadores numéricos + between)</p>
                </div>
                <div style="background: #fff; padding: 8px; border-radius: 6px;">
                  <strong>🌍 Ciudad</strong>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 0.85em;">Header Filter (valores únicos) + Filter Row (string)</p>
                </div>
                <div style="background: #fff; padding: 8px; border-radius: 6px;">
                  <strong>📅 Fecha Ingreso</strong>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 0.85em;">Header Filter (jerarquía año→mes) + Filter Row (rangos)</p>
                </div>
                <div style="background: #fff; padding: 8px; border-radius: 6px;">
                  <strong>🎂 Edad</strong>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 0.85em;">Filter Row (operadores numéricos)</p>
                </div>
                <div style="background: #fff; padding: 8px; border-radius: 6px;">
                  <strong>✔️ Activo</strong>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 0.85em;">Header Filter (booleano) + Filter Row (igual/no igual)</p>
                </div>
              </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
              <h5 style="margin-top: 0;">⚙️ Configuración de Paginación:</h5>
              <pre style="background: #fff; padding: 12px; border-radius: 6px; overflow-x: auto; font-size: 0.85em;"><code>paging: {
  enabled: true,
  pageSize: {
    visible: true,
    default: 10,
    options: [10, 25, 50, 100]
  },
  showInfo: true,
  navigation: {
    visible: true,
    showPrevNext: true,
    showFirstLast: true,
    maxButtons: 5,
    jumpTo: {
      visible: true,
      position: "inline"
    }
  },
  position: "bottom"
}</code></pre>
              <p style="margin: 10px 0 0 0; color: #555; font-size: 0.9em;">
                <strong>Importante:</strong> Los filtros no afectan los datos originales, solo cambian qué se muestra. Limpiar los filtros restaura el total original.
              </p>
            </div>

            <div style="margin-top: 20px;">
              <button id="filterITBtn" class="demo-button">🖥️ Filtrar: Solo IT</button>
              <button id="filterSalaryBtn" class="demo-button">💰 Filtrar: Salario > $60k</button>
              <button id="filterCombinedBtn" class="demo-button">🎯 Filtrar: IT + Salario > $60k</button>
              <button id="clearAllBtn" class="demo-button secondary">🗑️ Limpiar Filtros</button>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
              <h5 style="margin-top: 0;">📊 Estado Actual:</h5>
              <div id="infoPanel" style="font-family: monospace; line-height: 1.8; font-size: 0.9em;">
                <div>Total de empleados (original): <strong id="totalOriginal">100</strong></div>
                <div>Empleados filtrados: <strong id="totalFiltered">100</strong></div>
                <div>Página actual: <strong id="currentPage">1</strong></div>
                <div>Total de páginas: <strong id="totalPages">10</strong></div>
                <div>Mostrando en tabla: <strong id="showing">1-10</strong> de <strong id="showingTotal">100</strong></div>
              </div>
            </div>

            <div id="dataTable" style="margin-top: 20px;"></div>
          </div>
        </div>
      </div>

      <!-- Code Sandbox -->
      <div id="sandboxContainer"></div>
    </div>
  `;

  const data = generateData(340);

  const gridie = new Gridie({
    id: "tabla-paginacion-filtros",
    headers: [
      {
        label: "ID",
        type: "number",
        sortable: true,
      },
      {
        label: "Nombre",
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
        filters: {
          headerFilter: {
            visible: true,
            parameters: [
              { text: "Junior (<$50k)", operator: "<", value: 50000 },
              { text: "Mid ($50k - $65k)", operator: "between", value: 50000, value2: 65000 },
              { text: "Senior ($65k+)", operator: ">=", value: 65000 },
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
        filters: {
          headerFilter: {
            visible: true,
            dateHierarchy: ["year", "month"],
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
    body: data,
    enableSort: true,
    enableFilter: true,
    language: "es",
    paging: {
      enabled: true,
      pageSize: {
        visible: true,
        default: 15,
        options: [10,15, 25, 50, 100],
      },
      showInfo: true,
      navigation: {
        visible: true,
        showPrevNext: true,
        showFirstLast: true,
        maxButtons: 5,
        jumpTo: {
          visible: true,
          position: "inline",
          buttonText: "→",
        },
      },
      position: "bottom",
    },
  });

  container.querySelector("#dataTable")?.appendChild(gridie);

//   setTimeout(()=>{
//     gridie.setData({
//   headers: gridie.headers, 
//   data: [...generateData(30)]
// });
//   },4000)
  // Función para actualizar el panel de info
  function updateInfoPanel() {
    const totalOriginal = container.querySelector("#totalOriginal");
    const totalFiltered = container.querySelector("#totalFiltered");
    const currentPage = container.querySelector("#currentPage");
    const totalPages = container.querySelector("#totalPages");
    const showing = container.querySelector("#showing");
    const showingTotal = container.querySelector("#showingTotal");

    if (totalOriginal) totalOriginal.textContent = "100";
    if (totalFiltered) totalFiltered.textContent = String(gridie.getTotalItems());
    if (currentPage) currentPage.textContent = String(gridie.getCurrentPage());
    if (totalPages) totalPages.textContent = String(gridie.getTotalPages());
    
    const pageSize = gridie.getPageSize();
    const page = gridie.getCurrentPage();
    const total = gridie.getTotalItems();
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    
    if (showing) showing.textContent = `${start}-${end}`;
    if (showingTotal) showingTotal.textContent = String(total);
  }

  // Actualizar panel inicialmente
  updateInfoPanel();

  // Escuchar cambios de página
  gridie.addEventListener("pagechange", () => {
    updateInfoPanel();
  });

  // Botón: Filtrar solo IT
  container.querySelector("#filterITBtn")?.addEventListener("click", () => {
    // Simular clic en header filter de Departamento y seleccionar solo IT
    alert(`💡 Para aplicar este filtro manualmente:

1. Haz clic en el embudo del encabezado "Departamento"
2. Desmarca "Seleccionar todos"
3. Marca solo "IT"
4. Cierra el menú

📊 Resultado esperado:
   • Total filtrado: ~14 empleados (solo IT)
   • Páginas: 2 (14 ÷ 10 = 1.4 → 2 páginas)
   • Tabla resetea a página 1 automáticamente`);
  });

  // Botón: Filtrar salario > $60k
  container.querySelector("#filterSalaryBtn")?.addEventListener("click", () => {
    alert(`💡 Para aplicar este filtro manualmente:

1. En la fila de filtros debajo de "Salario"
2. Haz clic en el icono del operador (≡)
3. Selecciona ">" (mayor que)
4. Escribe "60000" en el input
5. Presiona Enter

📊 Resultado esperado:
   • Total filtrado: ~40 empleados (salario > $60k)
   • Páginas: 4 (40 ÷ 10 = 4 páginas)
   • Tabla resetea a página 1 automáticamente`);
  });

  // Botón: Filtrar combinado
  container.querySelector("#filterCombinedBtn")?.addEventListener("click", () => {
    alert(`💡 Para aplicar ambos filtros (AND):

🔹 PASO 1: Header Filter en Departamento
   • Clic en embudo de "Departamento"
   • Selecciona solo "IT"

🔹 PASO 2: Filter Row en Salario
   • Selecciona operador ">"
   • Escribe "60000"
   • Presiona Enter

📊 Resultado esperado:
   • Total filtrado: ~5 empleados (IT Y salario > $60k)
   • Páginas: 1 (5 items caben en 1 página)
   • Botones "Siguiente" y "Última" se deshabilitan

🎯 Ambos filtros deben cumplirse simultáneamente (AND).`);
  });

  // Botón: Limpiar todos los filtros
  container.querySelector("#clearAllBtn")?.addEventListener("click", () => {
    gridie.setData({
      headers: gridie.headers,
      data: data,
    });
    updateInfoPanel();
  });

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