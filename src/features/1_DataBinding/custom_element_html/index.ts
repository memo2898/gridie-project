// src/features/1_DataBinding/custom_element_html/index.ts
import { Sandbox } from '../../../components/sandbox/sandbox';
import { Gridie } from '../../../gridie/gridie';
import { tsCode, jsCode, htmlCode } from './sources/sources';

export function render(container: HTMLElement): void {
  container.innerHTML = `
    <div class="feature-layout">
      <!-- Demo Window -->
      <div class="demo-window">
        <div class="window-header">
          <span class="window-title">Demo - Custom Element con HTML Inyectado</span>
        </div>
        <div class="window-content">
          <h3>Columnas con HTML y Eventos (Por Posición)</h3>
          <p>La relación entre headers y body es por POSICIÓN, no por nombre de campo.</p>
          
          <div class="demo-section">
            <h4>Ejemplo con Acciones Personalizadas</h4>
            <button id="updateDataBtn" class="demo-button">Actualizar Datos</button>
            <div id="dataTable"></div>
          </div>
        </div>
      </div>

      <!-- Code Sandbox -->
      <div id="sandboxContainer"></div>
    </div>
  `;

  const gridie = document.createElement('gridie-table') as Gridie;
  
  const config = {
    id: "tabla-html",
    headers: [
      "productos",  // Posición 0
      { label: "Precio", type: "number" as const },  // Posición 1
      { label: "Stock", type: "number" as const },  // Posición 2
      { label: "Disponible", type: "boolean" as const },  // Posición 3
      "Acciones"  // Posición 4
    ],
    body: [
      { 
        campoContent: "Laptop",  // Posición 0 (no importa el nombre)
        precio: 1200,  // Posición 1
        stock: 5,  // Posición 2
        disponible: true,  // Posición 3
        acciones: [  // Posición 4
          {
            content: '<button style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Ver</button>',
            event: 'click',
            funct: (row: any, index: number) => {
              const values = Object.values(row);
              alert(`Ver producto: ${values[0]}\nPrecio: $${values[1]}\nÍndice: ${index}`);
            }
          },
          {
            content: '<button style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>',
            event: 'click',
            funct: (row: any, index: number) => {
              const values = Object.values(row);
              if (confirm(`¿Eliminar ${values[0]}?`)) {
                gridie.removeRow(index);
              }
            }
          }
        ]
      },
      { 
        nombreProducto: "Mouse",  // Posición 0 (nombre diferente, pero funciona!)
        price: 25,  // Posición 1 (nombre diferente!)
        cantidad: 50,  // Posición 2 (nombre diferente!)
        activo: true,  // Posición 3
        botones: [  // Posición 4
          {
            content: '<button style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Ver</button>',
            event: 'click',
            funct: (row: any, index: number) => {
              const values = Object.values(row);
              alert(`Ver producto: ${values[0]}\nPrecio: $${values[1]}`);
            }
          },
          {
            content: '<button style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>',
            event: 'click',
            funct: (row: any, index: number) => {
              if (confirm('¿Eliminar este producto?')) {
                gridie.removeRow(index);
              }
            }
          }
        ]
      },
      { 
        prod: "Teclado",  // Posición 0
        cost: 75,  // Posición 1
        inventory: 30,  // Posición 2
        available: true,  // Posición 3
        actions: [  // Posición 4
          {
            content: '<button style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Ver</button>',
            event: 'click',
            funct: (row: any, index: number) => {
              const values = Object.values(row);
              alert(`Ver producto: ${values[0]}`);
            }
          },
          {
            content: '<button style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>',
            event: 'click',
            funct: (row: any, index: number) => {
              if (confirm('¿Eliminar?')) {
                gridie.removeRow(index);
              }
            }
          }
        ]
      },
    ],
    
  };

  gridie.setConfig(config);
  document.getElementById('dataTable')?.appendChild(gridie);

  document.getElementById('updateDataBtn')?.addEventListener('click', () => {
    gridie.addRow({ 
      cualquierNombre: "Webcam",  // Posición 0
      valor: 85,  // Posición 1
      existencias: 15,  // Posición 2
      enStock: true,  // Posición 3
      botonesAccion: [  // Posición 4
        {
          content: '<button style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Ver</button>',
          event: 'click',
          funct: (row: any, index: number) => {
            const values = Object.values(row);
            alert(`Ver producto: ${values[0]}`);
          }
        },
        {
          content: '<button style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>',
          event: 'click',
          funct: (row: any, index: number) => {
            if (confirm('¿Eliminar?')) {
              gridie.removeRow(index);
            }
          }
        }
      ]
    });
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