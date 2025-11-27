// src/features/1_DataBinding/simple_array/index.ts
import { Sandbox } from '../../../components/sandbox/sandbox';
import { Gridie } from '../../../gridie/gridie';
import { tsCode, jsCode, htmlCode } from './sources/sources';

export function render(container: HTMLElement): void {
  container.innerHTML = `
    <div class="feature-layout">
      <!-- Demo Window -->
      <div class="demo-window">
        <div class="window-header">
          <span class="window-title">Demo - Data Binding Simple</span>
        </div>
        <div class="window-content">
          <h3>Headers Simples (Strings)</h3>
          <p>Demostración usando solo strings para headers sin configuración adicional.</p>
          
          <div class="demo-section">
            <h4>Configuración Minimalista</h4>
            <button id="loadDataBtn" class="demo-button">Cargar Datos</button>
            <button id="clearDataBtn" class="demo-button secondary">Limpiar Datos</button>
            <div id="dataTable"></div>
          </div>
        </div>
      </div>

      <!-- Code Sandbox -->
      <div id="sandboxContainer"></div>
    </div>
  `;

  // Configuración simple con headers como strings
  const config = {
    id: "tabla-simple",
    headers: ["Nombre", "Email", "Teléfono", "Ciudad"],
    body: [
      { Nombre: "Juan Pérez", Email: "juan@example.com", Teléfono: "809-555-1234", Ciudad: "Santo Domingo" },
      { Nombre: "María García", Email: "maria@example.com", Teléfono: "809-555-5678", Ciudad: "Santiago" },
      { Nombre: "Carlos López", Email: "carlos@example.com", Teléfono: "809-555-9012", Ciudad: "La Vega" },
    ],
  };

  // Instanciar Gridie
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