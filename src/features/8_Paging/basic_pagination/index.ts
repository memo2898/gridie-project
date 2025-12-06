// src/features/8_Paging/basic_pagination/index.ts
import { Sandbox } from "../../../components/sandbox/sandbox";
import { Gridie } from "../../../gridie/gridie";
import { tsCode, jsCode, htmlCode } from "./sources/sources";

export function render(container: HTMLElement): void {
  container.innerHTML = `
    <div class="feature-layout">
      <!-- Demo Window -->
      <div class="demo-window">
        <div class="window-header">
          <span class="window-title">Demo - Paginación Básica</span>
        </div>
        <div class="window-content">
          <h3>Paginación CLIENT Mode</h3>
          <p>Sistema de paginación completo con todos los controles: selector de tamaño, información de registros, navegación y control de salto rápido.</p>
          
          <div class="demo-section">
            <h4>✨ Características</h4>
            <ul style="list-style: disc; margin-left: 20px; line-height: 1.8;">
              <li><strong>Selector de PageSize:</strong> Cambia cuántos items ver por página (10, 25, 50, 100)</li>
              <li><strong>Info de Registros:</strong> Muestra "Mostrando X-Y de Z items"</li>
              <li><strong>Botones de Navegación:</strong> Primera (<<), Anterior (<), Siguiente (>), Última (>>)</li>
              <li><strong>Botones Numéricos:</strong> Navegación directa con ellipsis inteligente</li>
              <li><strong>Control de Salto:</strong> Input para ir directamente a una página específica</li>
              <li><strong>Validación:</strong> Botones disabled cuando corresponde</li>
            </ul>

            <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
              <h5 style="margin-top: 0;">📊 Estado Actual:</h5>
              <div style="background: #fff; padding: 12px; border-radius: 6px; font-family: monospace;">
                <div>Página: <strong id="current-page">1</strong> de <strong id="total-pages">10</strong></div>
                <div>Items por página: <strong id="page-size">10</strong></div>
                <div>Total de items: <strong id="total-items">100</strong></div>
                <div>Mostrando: <strong id="showing-range">1-10</strong></div>
              </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #fff3e0; border-radius: 8px; border-left: 4px solid #ff9800;">
              <h5 style="margin-top: 0;">🎯 Prueba Estos Controles:</h5>
              <div style="display: grid; gap: 10px; font-size: 0.9em;">
                <div>🔹 <strong>Selector de tamaño:</strong> Cambia entre 10, 25, 50, 100 items</div>
                <div>🔹 <strong>Botones << >>:</strong> Ir a primera/última página</div>
                <div>🔹 <strong>Botones < >:</strong> Página anterior/siguiente</div>
                <div>🔹 <strong>Botones numéricos:</strong> Click en cualquier número</div>
                <div>🔹 <strong>Ir a página:</strong> Escribe un número y presiona Enter o →</div>
              </div>
            </div>

            <div style="margin-top: 20px;">
              <button id="goto5Btn" class="demo-button">📍 Ir a Página 5</button>
              <button id="setSize25Btn" class="demo-button">📏 PageSize: 25</button>
              <button id="lastPageBtn" class="demo-button">⏭ Última Página</button>
              <button id="resetBtn" class="demo-button secondary">🔄 Resetear</button>
            </div>

            <div id="dataTable"></div>
          </div>
        </div>
      </div>

      <!-- Code Sandbox -->
      <div id="sandboxContainer"></div>
    </div>
  `;

  // Generar datos de prueba
  const generateData = (count: number) => {
    const departments = ['IT', 'Ventas', 'Marketing', 'RRHH', 'Finanzas', 'Desarrollo', 'QA'];
    const names = ['Juan', 'María', 'Pedro', 'Ana', 'Luis', 'Carmen', 'José', 'Laura', 'Carlos', 'Isabel'];
    const lastNames = ['Pérez', 'García', 'López', 'Martínez', 'Rodríguez', 'González', 'Hernández', 'Díaz'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      nombre: `${names[i % names.length]} ${lastNames[i % lastNames.length]}`,
      departamento: departments[i % departments.length],
      salario: 30000 + (i * 1000),
      edad: 25 + (i % 40),
    }));
  };

  const data = generateData(100);

  const config = {
    id: "tabla-paginacion-basica",
    headers: [
      { label: "ID", type: "number" as const, sortable: true },
      { label: "Nombre", type: "string" as const, sortable: true },
      { label: "Departamento", type: "string" as const, sortable: true },
      { label: "Salario", type: "number" as const, sortable: true },
      { label: "Edad", type: "number" as const, sortable: true },
    ],
    body: data,
    
    mode: "client" as const,
    enableSort: true,
    language: "es" as const,
    
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
        maxButtons: 5,
        
        jumpTo: {
          visible: true,
          position: "inline" as const,
          buttonText: "→",
        },
      },
      
      position: "bottom" as const,
    },
  };

  // ✅ CORRECCIÓN: Usar new Gridie() en lugar de createElement
  const gridie = new Gridie(config);
  document.getElementById("dataTable")?.appendChild(gridie);

  // Actualizar info panel
  const updateInfo = () => {
    document.getElementById("current-page")!.textContent = gridie.getCurrentPage().toString();
    document.getElementById("total-pages")!.textContent = gridie.getTotalPages().toString();
    document.getElementById("page-size")!.textContent = gridie.getPageSize().toString();
    document.getElementById("total-items")!.textContent = gridie.getTotalItems().toString();
    
    const start = (gridie.getCurrentPage() - 1) * gridie.getPageSize() + 1;
    const end = Math.min(gridie.getCurrentPage() * gridie.getPageSize(), gridie.getTotalItems());
    document.getElementById("showing-range")!.textContent = `${start}-${end}`;
  };

  gridie.addEventListener("pagechange", updateInfo);

  // Botones de control
  document.getElementById("goto5Btn")?.addEventListener("click", () => {
    gridie.goToPage(5);
  });

  document.getElementById("setSize25Btn")?.addEventListener("click", () => {
    gridie.setPageSize(25);
  });

  document.getElementById("lastPageBtn")?.addEventListener("click", () => {
    gridie.lastPage();
  });

  document.getElementById("resetBtn")?.addEventListener("click", () => {
    gridie.setConfig(config);
    updateInfo();
  });

  // Sandbox
  new Sandbox("sandboxContainer", {
    files: [
      { fileName: "index.ts", code: tsCode, language: "typescript" },
      { fileName: "index.js", code: jsCode, language: "javascript" },
      { fileName: "index.html", code: htmlCode, language: "html" },
    ],
    activeFile: 0,
  });
}

export default render;