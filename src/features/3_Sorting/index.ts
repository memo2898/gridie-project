// src/features/3_Sorting/index.ts
import { Sandbox } from '../../components/sandbox/sandbox';
import { Gridie } from '../../gridie/gridie';
import { tsCode, jsCode, htmlCode } from './sources/sources';

export function render(container: HTMLElement): void {
  container.innerHTML = `
    <div class="feature-layout">
      <!-- Demo Window -->
      <div class="demo-window">
        <div class="window-header">
          <span class="window-title">Demo - Sorting (Ordenamiento)</span>
        </div>
        <div class="window-content">
          <h3>Ordenamiento de Datos</h3>
          <p>Gridie soporta ordenamiento de múltiples columnas simultáneamente.</p>
          
          <div class="demo-section">
            <h4>Características de Sorting</h4>
            <ul style="list-style: disc; margin-left: 20px; line-height: 1.8;">
              <li><strong>Click en header:</strong> Alterna entre ASC → DESC → Sin orden</li>
              <li><strong>Click derecho en header:</strong> Muestra menú contextual con opciones</li>
              <li><strong>Multi-column sorting:</strong> Ordena por múltiples columnas a la vez</li>
              <li><strong>Indicadores visuales:</strong> Flechas (▲▼) y números de orden</li>
              <li><strong>Limpiar ordenamiento:</strong> Por columna o todas a la vez</li>
            </ul>

            <div style="margin-top: 20px;">
              <button id="addEmployeeBtn" class="demo-button">Agregar Empleado</button>
              <button id="clearSortBtn" class="demo-button secondary">Limpiar Todo el Ordenamiento</button>
            </div>

            <div id="dataTable" style="margin-top: 20px;"></div>
          </div>
        </div>
      </div>

      <!-- Code Sandbox -->
      <div id="sandboxContainer"></div>
    </div>
  `;

  const gridie = document.createElement('gridie-table') as Gridie;
  
  const config = {
    id: "tabla-empleados",
    headers: [
      { label: "ID", type: "number" as const },
      "Nombre",
      "Departamento",
      { label: "Salario", type: "number" as const },
      { label: "Fecha Ingreso", type: "date" as const },
      { label: "Activo", type: "boolean" as const }
    ],
    body: [
      { 
        id: 1, 
        nombre: "Juan Pérez", 
        departamento: "Ventas", 
        salario: 45000, 
        fecha: "2020-03-15",
        activo: true 
      },
      { 
        id: 2, 
        nombre: "María García", 
        departamento: "IT", 
        salario: 65000, 
        fecha: "2019-07-22",
        activo: true 
      },
      { 
        id: 3, 
        nombre: "Carlos López", 
        departamento: "Recursos Humanos", 
        salario: 52000, 
        fecha: "2021-01-10",
        activo: true 
      },
      { 
        id: 4, 
        nombre: "Ana Martínez", 
        departamento: "IT", 
        salario: 70000, 
        fecha: "2018-11-05",
        activo: false 
      },
      { 
        id: 5, 
        nombre: "Luis Rodríguez", 
        departamento: "Ventas", 
        salario: 48000, 
        fecha: "2020-09-18",
        activo: true 
      },
      { 
        id: 6, 
        nombre: "Elena Fernández", 
        departamento: "Marketing", 
        salario: 55000, 
        fecha: "2019-04-30",
        activo: true 
      },
      { 
        id: 7, 
        nombre: "Pedro Sánchez", 
        departamento: "IT", 
        salario: 68000, 
        fecha: "2021-06-12",
        activo: true 
      },
      { 
        id: 8, 
        nombre: "Laura Torres", 
        departamento: "Recursos Humanos", 
        salario: 50000, 
        fecha: "2020-02-25",
        activo: false 
      }
    ],
    enableSort: true,
    language: 'es' as const
  };

  gridie.setConfig(config);
  document.getElementById('dataTable')?.appendChild(gridie);

  // Botón para agregar empleado
  document.getElementById('addEmployeeBtn')?.addEventListener('click', () => {
    const nombres = ["Roberto", "Sandra", "Miguel", "Patricia", "Diego"];
    const apellidos = ["González", "Ramírez", "Vargas", "Castro", "Morales"];
    const departamentos = ["IT", "Ventas", "Marketing", "Recursos Humanos"];
    
    const randomNombre = nombres[Math.floor(Math.random() * nombres.length)];
    const randomApellido = apellidos[Math.floor(Math.random() * apellidos.length)];
    const randomDept = departamentos[Math.floor(Math.random() * departamentos.length)];
    const randomSalario = Math.floor(Math.random() * 50000) + 40000;
    
    const newEmployee = {
      id: Date.now(),
      nombre: `${randomNombre} ${randomApellido}`,
      departamento: randomDept,
      salario: randomSalario,
      fecha: new Date().toISOString().split('T')[0],
      activo: true
    };
    
    gridie.addRow(newEmployee);
  });

  // Botón para limpiar ordenamiento (usando método interno)
  document.getElementById('clearSortBtn')?.addEventListener('click', () => {
    // Reiniciar la configuración para limpiar el sort
    gridie.setConfig(config);
  });

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