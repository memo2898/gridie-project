import { Gridie } from "../../../gridie/gridie";
import { typescriptCode, javascriptCode, htmlCode } from "./sources/sources";

// Datos de ejemplo
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
      <h1>Pagination Positions</h1>
      <p>Ejemplos de diferentes posiciones del footer de paginación: <code>top</code>, <code>bottom</code>, y <code>both</code>.</p>
      
      <hr style="margin: 30px 0;">
      
      <!-- Position: TOP -->
      <div style="margin-bottom: 50px;">
        <h2>Position: TOP</h2>
        <p>El footer de paginación aparece <strong>arriba</strong> de la tabla.</p>
        <div id="table-top"></div>
      </div>
      
      <hr style="margin: 30px 0;">
      
      <!-- Position: BOTTOM (default) -->
      <div style="margin-bottom: 50px;">
        <h2>Position: BOTTOM (default)</h2>
        <p>El footer de paginación aparece <strong>abajo</strong> de la tabla.</p>
        <div id="table-bottom"></div>
      </div>
      
      <hr style="margin: 30px 0;">
      
      <!-- Position: BOTH -->
      <div style="margin-bottom: 50px;">
        <h2>Position: BOTH</h2>
        <p>El footer de paginación aparece <strong>arriba Y abajo</strong> de la tabla.</p>
        <div id="table-both"></div>
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

  const data = generateData(50);

  // ========== TABLA 1: POSITION TOP ==========
  const gridieTop = new Gridie({
    id: "pagination-top",
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
      position: "top",
      pageSize: {
        visible: true,
        default: 10,
        options: [10, 25, 50],
      },
      showInfo: true,
      navigation: {
        visible: true,
        showPrevNext: true,
        showFirstLast: true,
        maxButtons: 5,
      },
    },
  });

  container.querySelector("#table-top")?.appendChild(gridieTop);

  // ========== TABLA 2: POSITION BOTTOM ==========
  const gridieBottom = new Gridie({
    id: "pagination-bottom",
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
      position: "bottom",
      pageSize: {
        visible: true,
        default: 10,
        options: [10, 25, 50],
      },
      showInfo: true,
      navigation: {
        visible: true,
        showPrevNext: true,
        showFirstLast: true,
        maxButtons: 5,
      },
    },
  });

  container.querySelector("#table-bottom")?.appendChild(gridieBottom);

  // ========== TABLA 3: POSITION BOTH ==========
  const gridieBoth = new Gridie({
    id: "pagination-both",
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
      position: "both",
      pageSize: {
        visible: true,
        default: 10,
        options: [10, 25, 50],
      },
      showInfo: true,
      navigation: {
        visible: true,
        showPrevNext: true,
        showFirstLast: true,
        maxButtons: 5,
      },
    },
  });

  container.querySelector("#table-both")?.appendChild(gridieBoth);

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