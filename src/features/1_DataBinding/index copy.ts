// src/features/1_DataBinding/index.ts
import { Sandbox } from '../../components/sandbox/sandbox';

export function render(container: HTMLElement): void {
  const tsCode = `// src/features/1_DataBinding/index.ts

export function render(container: HTMLElement): void {
  const sampleData = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', edad: 28 },
    { id: 2, nombre: 'María García', email: 'maria@example.com', edad: 34 }
  ];
  
  const loadDataBtn = document.querySelector('#loadDataBtn') as HTMLButtonElement;
  const dataTable = document.querySelector('#dataTable') as HTMLDivElement;
  
  loadDataBtn.addEventListener('click', () => {
    renderTable(sampleData);
  });
  
  function renderTable(data: any[]) {
    const table = document.createElement('table');
    table.className = 'data-table';
    // ... crear tabla
    dataTable.appendChild(table);
  }
}

export default render;`;

  const jsCode = `// src/features/1_DataBinding/index.js

export function render(container) {
  const sampleData = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', edad: 28 },
    { id: 2, nombre: 'María García', email: 'maria@example.com', edad: 34 }
  ];
  
  const loadDataBtn = document.querySelector('#loadDataBtn');
  const dataTable = document.querySelector('#dataTable');
  
  loadDataBtn.addEventListener('click', () => {
    renderTable(sampleData);
  });
  
  function renderTable(data) {
    const table = document.createElement('table');
    table.className = 'data-table';
    // ... crear tabla
    dataTable.appendChild(table);
  }
}

export default render;`;

  const htmlCode = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Data Binding Example</title>
</head>
<body>
  <h3>Data Binding Feature</h3>
  <button id="loadDataBtn">Cargar Datos</button>
  <div id="dataTable"></div>
  
  <script type="module" src="./index.js"></script>
</body>
</html>`;

  container.innerHTML = `
    <div class="feature-layout">
      <!-- Demo Window -->
      <div class="demo-window">
        <div class="window-header">
          <span class="window-title">Demo - Data Binding</span>
        </div>
        <div class="window-content">
          <h3>Data Binding Feature</h3>
          <p>Esta funcionalidad muestra cómo enlazar datos a la tabla.</p>
          
          <div class="demo-section">
            <h4>Ejemplo de Data Binding</h4>
            <button id="loadDataBtn" class="demo-button">Cargar Datos</button>
            <button id="clearDataBtn" class="demo-button secondary">Limpiar Datos</button>
            <div id="dataTable"></div>
          </div>
        </div>
      </div>

      <!-- Code Sandbox con múltiples archivos -->
      <div id="sandboxContainer"></div>
    </div>
  `;

  // Inicializar el Sandbox con múltiples archivos
  new Sandbox('sandboxContainer', {
    files: [
      {
        fileName: 'index.ts',
        code: tsCode,
        language: 'typescript',
      },
      {
        fileName: 'index.js',
        code: jsCode,
        language: 'javascript',
      },
      {
        fileName: 'index.html',
        code: htmlCode,
        language: 'html',
      },
    ],
    activeFile: 0, // TypeScript por defecto
  });

  // Funcionalidad del demo
  const sampleData = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', edad: 28 },
    { id: 2, nombre: 'María García', email: 'maria@example.com', edad: 34 },
    { id: 3, nombre: 'Carlos López', email: 'carlos@example.com', edad: 25 },
  ];

  const loadDataBtn = container.querySelector('#loadDataBtn') as HTMLButtonElement;
  const clearDataBtn = container.querySelector('#clearDataBtn') as HTMLButtonElement;
  const dataTable = container.querySelector('#dataTable') as HTMLDivElement;

  function renderTable(data: any[]) {
    const table = document.createElement('table');
    table.className = 'data-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    Object.keys(data[0]).forEach(key => {
      const th = document.createElement('th');
      th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach(row => {
      const tr = document.createElement('tr');
      Object.values(row).forEach(value => {
        const td = document.createElement('td');
        td.textContent = String(value);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    dataTable.innerHTML = '';
    dataTable.appendChild(table);
  }

  loadDataBtn.addEventListener('click', () => renderTable(sampleData));
  clearDataBtn.addEventListener('click', () => {
    dataTable.innerHTML = '<p style="color: #888;">Datos limpiados</p>';
  });
}

export default render;