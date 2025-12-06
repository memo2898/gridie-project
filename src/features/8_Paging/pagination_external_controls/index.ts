import { Gridie } from "../../../gridie/gridie";
import { typescriptCode, javascriptCode, htmlCode } from "./sources/sources";

function generateData(count: number) {
  const departments = ["IT", "HR", "Sales", "Marketing", "Finance"];
  const data = [];

  for (let i = 1; i <= count; i++) {
    data.push({
      id: i,
      name: `Employee ${i}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      salary: Math.floor(Math.random() * 50000) + 30000,
      age: Math.floor(Math.random() * 40) + 22,
      active: Math.random() > 0.3,
    });
  }

  return data;
}

export function render(container: HTMLElement): void {
  container.innerHTML = `
    <div style="padding: 20px;">
      <h1>External Pagination Controls</h1>
      <p>Control programático de la paginación usando los métodos públicos de Gridie.</p>
      
      <hr style="margin: 30px 0;">
      
      <div id="table-container"></div>
      
      <hr style="margin: 30px 0;">
      
      <!-- Controles Externos -->
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
        <h3>🎮 Controles Externos</h3>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 15px;">
          <button id="btn-first" style="padding: 8px 16px; cursor: pointer;">⏮ Primera</button>
          <button id="btn-prev" style="padding: 8px 16px; cursor: pointer;">◀ Anterior</button>
          <button id="btn-next" style="padding: 8px 16px; cursor: pointer;">Siguiente ▶</button>
          <button id="btn-last" style="padding: 8px 16px; cursor: pointer;">Última ⏭</button>
          
          <div style="width: 100%; margin: 10px 0;"></div>
          
          <button id="btn-goto-5" style="padding: 8px 16px; cursor: pointer;">Ir a Página 5</button>
          <button id="btn-goto-10" style="padding: 8px 16px; cursor: pointer;">Ir a Página 10</button>
          
          <div style="width: 100%; margin: 10px 0;"></div>
          
          <button id="btn-size-10" style="padding: 8px 16px; cursor: pointer;">10 por página</button>
          <button id="btn-size-25" style="padding: 8px 16px; cursor: pointer;">25 por página</button>
          <button id="btn-size-50" style="padding: 8px 16px; cursor: pointer;">50 por página</button>
        </div>
      </div>
      
      <hr style="margin: 30px 0;">
      
      <!-- Panel de información -->
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <h3>📊 Estado Actual</h3>
        <div id="info-panel" style="font-family: monospace; line-height: 1.8;">
          <div>Página actual: <strong id="info-page">-</strong></div>
          <div>Total de páginas: <strong id="info-total-pages">-</strong></div>
          <div>Tamaño de página: <strong id="info-page-size">-</strong></div>
          <div>Total de items: <strong id="info-total-items">-</strong></div>
        </div>
      </div>
      
      <hr style="margin: 30px 0;">
      
      <!-- Code Examples -->
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-top: 30px;">
        <h3>📝 Código de Ejemplo</h3>
        <div style="margin-top: 15px;">
          <button id="btn-typescript" style="padding: 8px 16px; margin-right: 10px; cursor: pointer;">TypeScript</button>
          <button id="btn-javascript" style="padding: 8px 16px; margin-right: 10px; cursor: pointer;">JavaScript</button>
          <button id="btn-html" style="padding: 8px 16px; cursor: pointer;">HTML</button>
        </div>
        <pre id="code-display" style="background: white; padding: 15px; border-radius: 4px; overflow-x: auto; margin-top: 15px;"><code></code></pre>
      </div>
    </div>
  `;

  const data = generateData(100);

  // ========== CREAR TABLA ==========
  const gridie = new Gridie({
    id: "pagination-external",
    headers: [
      { label: "ID", type: "number" },
      { label: "Name", type: "string" },
      { label: "Department", type: "string" },
      { label: "Salary", type: "number" },
      { label: "Age", type: "number" },
      { label: "Active", type: "boolean" },
    ],
    body: data,
    enableSort: true,
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
          position: "inline",
        },
      },
      position: "bottom",
    },
  });

  container.querySelector("#table-container")?.appendChild(gridie);

  // ========== FUNCIÓN PARA ACTUALIZAR INFO PANEL ==========
  function updateInfoPanel() {
    const infoPage = container.querySelector("#info-page");
    const infoTotalPages = container.querySelector("#info-total-pages");
    const infoPageSize = container.querySelector("#info-page-size");
    const infoTotalItems = container.querySelector("#info-total-items");

    if (infoPage) infoPage.textContent = String(gridie.getCurrentPage());
    if (infoTotalPages) infoTotalPages.textContent = String(gridie.getTotalPages());
    if (infoPageSize) infoPageSize.textContent = String(gridie.getPageSize());
    if (infoTotalItems) infoTotalItems.textContent = String(gridie.getTotalItems());
  }

  // Inicializar panel
  updateInfoPanel();

  // Escuchar eventos de cambio de página
  gridie.addEventListener("pagechange", () => {
    updateInfoPanel();
  });

  // ========== ADJUNTAR EVENTOS A BOTONES ==========
  container.querySelector("#btn-first")?.addEventListener("click", () => {
    gridie.firstPage();
  });

  container.querySelector("#btn-prev")?.addEventListener("click", () => {
    gridie.previousPage();
  });

  container.querySelector("#btn-next")?.addEventListener("click", () => {
    gridie.nextPage();
  });

  container.querySelector("#btn-last")?.addEventListener("click", () => {
    gridie.lastPage();
  });

  container.querySelector("#btn-goto-5")?.addEventListener("click", () => {
    gridie.goToPage(5);
  });

  container.querySelector("#btn-goto-10")?.addEventListener("click", () => {
    gridie.goToPage(10);
  });

  container.querySelector("#btn-size-10")?.addEventListener("click", () => {
    gridie.setPageSize(10);
    updateInfoPanel();
  });

  container.querySelector("#btn-size-25")?.addEventListener("click", () => {
    gridie.setPageSize(25);
    updateInfoPanel();
  });

  container.querySelector("#btn-size-50")?.addEventListener("click", () => {
    gridie.setPageSize(50);
    updateInfoPanel();
  });

  // ========== CODE DISPLAY ==========
  const codeDisplay = container.querySelector("#code-display")?.querySelector("code");

  function showCode(code: string) {
    if (codeDisplay) {
      codeDisplay.textContent = code;
    }
  }

  // Mostrar TypeScript por defecto
  showCode(typescriptCode);

  // Botones para cambiar código
  container.querySelector("#btn-typescript")?.addEventListener("click", () => {
    showCode(typescriptCode);
  });

  container.querySelector("#btn-javascript")?.addEventListener("click", () => {
    showCode(javascriptCode);
  });

  container.querySelector("#btn-html")?.addEventListener("click", () => {
    showCode(htmlCode);
  });
}