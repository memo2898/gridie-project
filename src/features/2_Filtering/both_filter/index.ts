// src/features/4_FilterRow/index.ts
import { Sandbox } from "../../../components/sandbox/sandbox";
import { Gridie } from "../../../gridie/gridie";
import { tsCode, jsCode, htmlCode } from "./sources/sources";

export function render(container: HTMLElement): void {
  container.innerHTML = `
    <div class="feature-layout">
      <!-- Demo Window -->
      <div class="demo-window">
        <div class="window-header">
          <span class="window-title">Demo - Filter Row (Fila de Filtros)</span>
        </div>
        <div class="window-content">
          <h3>Filtrado de Datos por Fila</h3>
          <p>Gridie soporta filtrado avanzado con múltiples operadores según el tipo de dato.</p>
          
          <div class="demo-section">
            <h4>Características del Filter Row</h4>
            <ul style="list-style: disc; margin-left: 20px; line-height: 1.8;">
              <li><strong>Filtrado automático:</strong> Se aplica mientras escribes</li>
              <li><strong>Operadores por tipo:</strong> Cada columna tiene operadores específicos según su tipo de dato</li>
              <li><strong>Múltiples filtros simultáneos:</strong> Los filtros se combinan con AND</li>
              <li><strong>Operador "Between":</strong> Para rangos numéricos y fechas (muestra dos inputs)</li>
              <li><strong>Botón de limpieza (✕):</strong> Limpia el valor sin remover el FilterRow</li>
              <li><strong>Tipos soportados:</strong> string, number, date, boolean</li>
            </ul>

            <div style="margin-top: 20px; padding: 15px; background: #f0f7ff; border-radius: 8px; border-left: 4px solid #667eea;">
              <h5 style="margin-top: 0;">💡 Operadores disponibles:</h5>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 0.9em;">
                <div>
                  <strong>String:</strong><br/>
                  Contiene, No contiene, Comienza con, Termina con, Igual, No igual
                </div>
                <div>
                  <strong>Number/Date:</strong><br/>
                  =, ≠, &lt;, &gt;, ≤, ≥, Entre
                </div>
                <div>
                  <strong>Boolean:</strong><br/>
                  Igual, No igual
                </div>
              </div>
            </div>

            <div style="margin-top: 20px;">
              <button id="addEmployeeBtn" class="demo-button">Agregar Empleado</button>
              <button id="clearFiltersBtn" class="demo-button secondary">Limpiar Todos los Filtros</button>
              <button id="filterITBtn" class="demo-button">Filtrar IT (Salario > 60k)</button>
            </div>

            <div id="dataTable" style="margin-top: 20px;"></div>
          </div>
        </div>
      </div>

      <!-- Code Sandbox -->
      <div id="sandboxContainer"></div>
    </div>
  `;

  const gridie = document.createElement("gridie-table") as Gridie;

  const config = {
    id: "tabla-empleados-filtros",
    headers: [
      {
        label: "ID",
        type: "number" as const,
        filters: {
          filterRow: {
            visible: true,
            operators: ["=", "<>", "<", ">", "<=", ">=", "between"] as const
          }
        }
      },
      {
        label: "Nombre",
        type: "string" as const,
        filters: {
          filterRow: {
            visible: true,
            // No especificamos operators, usa defaults de string
          }
        }
      },
      {
        label: "Departamento",
        type: "string" as const,
        filters: {
          filterRow: {
            visible: true,
            operators: ["contains", "equals", "startswith"] as const
          }
        }
      },
      {
        label: "Salario",
        type: "number" as const,
        filters: {
          filterRow: {
            visible: true,
          }
        }
      },
      {
        label: "Fecha Ingreso",
        type: "date" as const,
        filters: {
          filterRow: {
            visible: true,
          }
        }
      },
      {
        label: "Activo",
        type: "boolean" as const,
        filters: {
          filterRow: {
            visible: true,
          }
        }
      }
    ],
    body: [
      {
        id: 1,
        nombre: "Juan Pérez",
        departamento: "Ventas",
        salario: 45000,
        fecha: "2020-03-15",
        activo: true,
      },
      {
        id: 2,
        nombre: "María García",
        departamento: "IT",
        salario: 65000,
        fecha: "2019-07-22",
        activo: true,
      },
      {
        id: 3,
        nombre: "Carlos López",
        departamento: "Recursos Humanos",
        salario: 52000,
        fecha: "2021-01-10",
        activo: true,
      },
      {
        id: 4,
        nombre: "Ana Martínez",
        departamento: "IT",
        salario: 70000,
        fecha: "2018-11-05",
        activo: false,
      },
      {
        id: 5,
        nombre: "Luis Rodríguez",
        departamento: "Ventas",
        salario: 48000,
        fecha: "2020-09-18",
        activo: true,
      },
      {
        id: 6,
        nombre: "Elena Fernández",
        departamento: "Marketing",
        salario: 55000,
        fecha: "2019-04-30",
        activo: true,
      },
      {
        id: 7,
        nombre: "Pedro Sánchez",
        departamento: "IT",
        salario: 68000,
        fecha: "2021-06-12",
        activo: true,
      },
      {
        id: 8,
        nombre: "Laura Torres",
        departamento: "Recursos Humanos",
        salario: 50000,
        fecha: "2020-02-25",
        activo: false,
      },
      {
        id: 9,
        nombre: "Roberto Díaz",
        departamento: "IT",
        salario: 72000,
        fecha: "2018-03-10",
        activo: true,
      },
      {
        id: 10,
        nombre: "Carmen Ruiz",
        departamento: "Marketing",
        salario: 58000,
        fecha: "2019-08-15",
        activo: true,
      },
    ],
    enableSort: true,
    language: "es" as const,
  };

  gridie.setConfig(config);
  document.getElementById("dataTable")?.appendChild(gridie);

  // Botón para agregar empleado
  document.getElementById("addEmployeeBtn")?.addEventListener("click", () => {
    const nombres = ["Roberto", "Sandra", "Miguel", "Patricia", "Diego", "Lucía", "Fernando"];
    const apellidos = ["González", "Ramírez", "Vargas", "Castro", "Morales", "Silva", "Ortiz"];
    const departamentos = ["IT", "Ventas", "Marketing", "Recursos Humanos"];

    const randomNombre = nombres[Math.floor(Math.random() * nombres.length)];
    const randomApellido = apellidos[Math.floor(Math.random() * apellidos.length)];
    const randomDept = departamentos[Math.floor(Math.random() * departamentos.length)];
    const randomSalario = Math.floor(Math.random() * 50000) + 40000;
    
    // Fecha aleatoria entre 2018 y 2024
    const randomYear = 2018 + Math.floor(Math.random() * 7);
    const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const randomDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

    const newEmployee = {
      id: Date.now(),
      nombre: `${randomNombre} ${randomApellido}`,
      departamento: randomDept,
      salario: randomSalario,
      fecha: `${randomYear}-${randomMonth}-${randomDay}`,
      activo: Math.random() > 0.2, // 80% activos
    };

    gridie.addRow(newEmployee);
  });

  // Botón para limpiar todos los filtros
  document.getElementById("clearFiltersBtn")?.addEventListener("click", () => {
    gridie.setConfig(config);
  });

  // Botón de ejemplo: Filtrar IT con salario > 60k
  document.getElementById("filterITBtn")?.addEventListener("click", () => {
    // Reiniciar primero
    gridie.setConfig(config);
    
    // Simular que el usuario establece filtros manualmente
    // Nota: Esto es solo para demo, en la práctica el usuario usa los inputs
    setTimeout(() => {
      const deptSelect = gridie.shadowRoot?.querySelector(
        'select.filter-operator[data-column-index="2"]'
      ) as HTMLSelectElement;
      const deptInput = gridie.shadowRoot?.querySelector(
        'input.filter-input[data-column-index="2"]'
      ) as HTMLInputElement;
      
      const salarySelect = gridie.shadowRoot?.querySelector(
        'select.filter-operator[data-column-index="3"]'
      ) as HTMLSelectElement;
      const salaryInput = gridie.shadowRoot?.querySelector(
        'input.filter-input[data-column-index="3"]'
      ) as HTMLInputElement;

      if (deptSelect && deptInput) {
        deptSelect.value = 'equals';
        deptInput.value = 'IT';
        deptInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      if (salarySelect && salaryInput) {
        salarySelect.value = '>';
        salaryInput.value = '60000';
        salaryInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 100);
  });

  new Sandbox("sandboxContainer", {
    files: [
      {
        fileName: "index.ts",
        code: tsCode,
        language: "typescript",
      },
      {
        fileName: "index.js",
        code: jsCode,
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