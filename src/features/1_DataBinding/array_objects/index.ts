// src/features/1_DataBinding/array_objects/index.ts
import { Sandbox } from '../../../components/sandbox/sandbox';
import { Gridie } from '../../../gridie/gridie';
import { tsCode, jsCode, htmlCode } from './sources/sources';

export function render(container: HTMLElement): void {
  container.innerHTML = `
    <div class="feature-layout">
      <!-- Demo Window -->
      <div class="demo-window">
        <div class="window-header">
          <span class="window-title">Demo - Data Binding con Array de Objetos</span>
        </div>
        <div class="window-content">
          <h3>Array de Objetos</h3>
          <p>Esta demostración muestra cómo vincular un array de objetos a Gridie.</p>
          
          <div class="demo-section">
            <h4>Configuración Completa</h4>
            <button id="loadDataBtn" class="demo-button">Cargar Datos</button>
            <button id="clearDataBtn" class="demo-button secondary">Limpiar Datos</button>
            <button id="addRowBtn" class="demo-button">Agregar Fila</button>
            <div id="dataTable"></div>
          </div>
        </div>
      </div>

      <!-- Code Sandbox -->
      <div id="sandboxContainer"></div>
    </div>
  `;

  // Configuración con headers mixtos y datos complejos
  const config = {
    id: "tabla-usuarios",
    headers: [
      {
        field: "id",
        label: "ID",
        type: "number" as const,
        sortable: true,
      },
      "nombre", // Header simple como string
      {
        field: "email",
        label: "Correo Electrónico",
        sortable: true,
        filterable: true,
      },
      {
        field: "activo",
        label: "Estado",
        type: "boolean" as const,
      },
      {
        field: "edad",
        label: "Edad",
        type: "number" as const,
      },
    ],
    body: [
      { id: 1, nombre: "Juan Pérez", email: "juan@example.com", activo: true, edad: 30 },
      { id: 2, nombre: "María García", email: "maria@example.com", activo: false, edad: 25 },
      { id: 3, nombre: "Carlos López", email: "carlos@example.com", activo: true, edad: 35 },
      { id: 4, nombre: "Ana Martínez", email: "ana@example.com", activo: true, edad: 28 },
    ],
  };

  // Instanciar Gridie con configuración inicial
  const gridie = new Gridie(config);
  document.getElementById('dataTable')?.appendChild(gridie);

  // Event Listeners
  document.getElementById('loadDataBtn')?.addEventListener('click', () => {
    gridie.setConfig(config);
  });

  document.getElementById('clearDataBtn')?.addEventListener('click', () => {
    gridie.setConfig({
      id: config.id,
      headers: config.headers,
      body: [],
    });
  });

  document.getElementById('addRowBtn')?.addEventListener('click', () => {
    const newRow = {
      id: Date.now(),
      nombre: "Nuevo Usuario",
      email: "nuevo@example.com",
      activo: true,
      edad: 28,
    };
    gridie.addRow(newRow);
  });

  // Inicializar Sandbox
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
    activeFile: 0,
  });
}

export default render;