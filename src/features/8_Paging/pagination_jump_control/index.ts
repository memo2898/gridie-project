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
      <h1>Jump To Control</h1>
      <p>Ejemplos del control "Ir a página" en diferentes posiciones: <code>inline</code> y <code>below</code>.</p>
      
      <hr style="margin: 30px 0;">
      
      <!-- Jump To: INLINE (default) -->
      <div style="margin-bottom: 50px;">
        <h2>Jump To: INLINE (default)</h2>
        <p>El control "Ir a" aparece en la misma línea que los botones de navegación.</p>
        <div id="table-inline"></div>
      </div>
      
      <hr style="margin: 30px 0;">
      
      <!-- Jump To: BELOW -->
      <div style="margin-bottom: 50px;">
        <h2>Jump To: BELOW</h2>
        <p>El control "Ir a" aparece en una línea separada debajo de los controles principales.</p>
        <div id="table-below"></div>
      </div>
      
      <hr style="margin: 30px 0;">
      
      <!-- Jump To: DISABLED -->
      <div style="margin-bottom: 50px;">
        <h2>Jump To: DISABLED</h2>
        <p>Sin control "Ir a página".</p>
        <div id="table-disabled"></div>
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

  const data = generateData(200);

  // ========== TABLA 1: INLINE (default) ==========
  const gridieInline = new Gridie({
    id: "pagination-inline",
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
          buttonText: "→",
        },
      },
      position: "bottom",
    },
  });

  container.querySelector("#table-inline")?.appendChild(gridieInline);

  // ========== TABLA 2: BELOW ==========
  const gridieBelow = new Gridie({
    id: "pagination-below",
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
          position: "below",
          buttonText: "Go",
        },
      },
      position: "bottom",
    },
  });

  container.querySelector("#table-below")?.appendChild(gridieBelow);

  // ========== TABLA 3: DISABLED ==========
  const gridieDisabled = new Gridie({
    id: "pagination-disabled",
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
          visible: false,
        },
      },
      position: "bottom",
    },
  });

  container.querySelector("#table-disabled")?.appendChild(gridieDisabled);

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