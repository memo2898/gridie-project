// src/features/1_DataBinding/custom_element_html/sources/sources.ts
export const tsCode = `import { Gridie } from './gridie';

// Crear elemento usando DOM API
const gridie = document.createElement('gridie-table') as Gridie;

// Configurar con columna de acciones personalizadas
// IMPORTANTE: La relación es por POSICIÓN, no por nombre de campo
gridie.setConfig({
  id: "tabla-productos",
  headers: [
    "Producto",              // Posición 0
    { label: "Precio", type: "number" },  // Posición 1
    { label: "Stock", type: "number" },   // Posición 2
    { label: "Disponible", type: "boolean" },  // Posición 3
    "Acciones"               // Posición 4
  ],
  body: [
    { 
      producto: "Laptop Dell XPS 15",  // Posición 0
      precio: 1200,                     // Posición 1
      stock: 5,                         // Posición 2
      disponible: true,                 // Posición 3
      acciones: [                       // Posición 4
        {
          content: '<button style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Ver Detalles</button>',
          event: 'click',
          funct: (row: any, index: number) => {
            const values = Object.values(row);
            alert(\`Producto: \${values[0]}\\nPrecio: $\${values[1]}\\nStock: \${values[2]} unidades\`);
          }
        },
        {
          content: '<button style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>',
          event: 'click',
          funct: (row: any, index: number) => {
            const values = Object.values(row);
            if (confirm(\`¿Eliminar \${values[0]}?\`)) {
              gridie.removeRow(index);
            }
          }
        }
      ]
    },
    { 
      producto: "Mouse Logitech MX Master 3",  // Posición 0
      precio: 99,                               // Posición 1
      stock: 25,                                // Posición 2
      disponible: true,                         // Posición 3
      acciones: [                               // Posición 4
        {
          content: '<button style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Ver Detalles</button>',
          event: 'click',
          funct: (row: any, index: number) => {
            const values = Object.values(row);
            alert(\`Producto: \${values[0]}\\nPrecio: $\${values[1]}\`);
          }
        },
        {
          content: '<button style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>',
          event: 'click',
          funct: (row: any, index: number) => {
            const values = Object.values(row);
            if (confirm(\`¿Eliminar \${values[0]}?\`)) {
              gridie.removeRow(index);
            }
          }
        }
      ]
    },
    { 
      producto: "Teclado Mecánico Keychron K8",  // Posición 0
      precio: 85,                                 // Posición 1
      stock: 15,                                  // Posición 2
      disponible: true,                           // Posición 3
      acciones: [                                 // Posición 4
        {
          content: '<button style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Ver Detalles</button>',
          event: 'click',
          funct: (row: any, index: number) => {
            const values = Object.values(row);
            alert(\`Producto: \${values[0]}\\nPrecio: $\${values[1]}\`);
          }
        },
        {
          content: '<button style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>',
          event: 'click',
          funct: (row: any, index: number) => {
            const values = Object.values(row);
            if (confirm(\`¿Eliminar \${values[0]}?\`)) {
              gridie.removeRow(index);
            }
          }
        }
      ]
    },
  ],
});

// Agregar al DOM
document.body.appendChild(gridie);`;

export const jsCode = `// Crear elemento
const gridie = document.createElement('gridie-table');

// Configurar con acciones personalizadas
// La relación entre headers y body es por POSICIÓN
gridie.setConfig({
  id: "tabla-productos",
  headers: [
    "Producto",                               // Posición 0
    { label: "Precio", type: "number" },     // Posición 1
    { label: "Stock", type: "number" },      // Posición 2
    { label: "Disponible", type: "boolean" }, // Posición 3
    "Acciones"                                // Posición 4
  ],
  body: [
    { 
      producto: "Laptop Dell XPS 15",  // Posición 0
      precio: 1200,                     // Posición 1
      stock: 5,                         // Posición 2
      disponible: true,                 // Posición 3
      acciones: [                       // Posición 4
        {
          content: '<button style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Ver Detalles</button>',
          event: 'click',
          funct: function(row, index) {
            var values = Object.values(row);
            alert('Producto: ' + values[0] + '\\nPrecio: $' + values[1] + '\\nStock: ' + values[2]);
          }
        },
        {
          content: '<button style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>',
          event: 'click',
          funct: function(row, index) {
            var values = Object.values(row);
            if (confirm('¿Eliminar ' + values[0] + '?')) {
              gridie.removeRow(index);
            }
          }
        }
      ]
    },
    { 
      producto: "Mouse Logitech MX Master 3",  // Posición 0
      precio: 99,                               // Posición 1
      stock: 25,                                // Posición 2
      disponible: true,                         // Posición 3
      acciones: [                               // Posición 4
        {
          content: '<button style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Ver Detalles</button>',
          event: 'click',
          funct: function(row, index) {
            var values = Object.values(row);
            alert('Producto: ' + values[0] + '\\nPrecio: $' + values[1]);
          }
        },
        {
          content: '<button style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>',
          event: 'click',
          funct: function(row, index) {
            var values = Object.values(row);
            if (confirm('¿Eliminar ' + values[0] + '?')) {
              gridie.removeRow(index);
            }
          }
        }
      ]
    },
    { 
      producto: "Teclado Mecánico Keychron K8",  // Posición 0
      precio: 85,                                 // Posición 1
      stock: 15,                                  // Posición 2
      disponible: true,                           // Posición 3
      acciones: [                                 // Posición 4
        {
          content: '<button style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Ver Detalles</button>',
          event: 'click',
          funct: function(row, index) {
            var values = Object.values(row);
            alert('Producto: ' + values[0] + '\\nPrecio: $' + values[1]);
          }
        },
        {
          content: '<button style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>',
          event: 'click',
          funct: function(row, index) {
            var values = Object.values(row);
            if (confirm('¿Eliminar ' + values[0] + '?')) {
              gridie.removeRow(index);
            }
          }
        }
      ]
    },
  ],
});

// Agregar al DOM
document.body.appendChild(gridie);`;

export const htmlCode = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gridie - Custom Element con HTML Inyectado</title>
  <script src="gridie.js"></script>
</head>
<body>
  <h1>Gridie con Columnas Personalizadas</h1>
  <p>La relación entre headers y body es por <strong>POSICIÓN</strong>, no por nombre de campo.</p>
  
  <!-- Usar directamente en HTML -->
  <gridie-table id="mi-tabla"></gridie-table>

  <script>
    // Obtener referencia al elemento
    const gridie = document.getElementById('mi-tabla');
    
    // Configurar con columna de acciones HTML
    gridie.setConfig({
      id: "tabla-productos",
      headers: [
        "Producto",                               // Posición 0
        { label: "Precio", type: "number" },     // Posición 1
        { label: "Stock", type: "number" },      // Posición 2
        { label: "Disponible", type: "boolean" }, // Posición 3
        "Acciones"                                // Posición 4
      ],
      body: [
        { 
          producto: "Laptop Dell XPS 15",  // Posición 0
          precio: 1200,                     // Posición 1
          stock: 5,                         // Posición 2
          disponible: true,                 // Posición 3
          acciones: [                       // Posición 4
            {
              content: '<button style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Ver Detalles</button>',
              event: 'click',
              funct: function(row, index) {
                var values = Object.values(row);
                alert('Producto: ' + values[0] + '\\nPrecio: $' + values[1] + '\\nStock: ' + values[2] + ' unidades');
              }
            },
            {
              content: '<button style="padding: 6px 12px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Editar</button>',
              event: 'click',
              funct: function(row, index) {
                var values = Object.values(row);
                console.log('Editar producto:', values[0], 'en índice:', index);
              }
            },
            {
              content: '<button style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>',
              event: 'click',
              funct: function(row, index) {
                var values = Object.values(row);
                if (confirm('¿Eliminar ' + values[0] + '?')) {
                  gridie.removeRow(index);
                }
              }
            }
          ]
        },
        { 
          producto: "Mouse Logitech MX Master 3",  // Posición 0
          precio: 99,                               // Posición 1
          stock: 25,                                // Posición 2
          disponible: true,                         // Posición 3
          acciones: [                               // Posición 4
            {
              content: '<button style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Ver Detalles</button>',
              event: 'click',
              funct: function(row, index) {
                var values = Object.values(row);
                alert('Producto: ' + values[0] + '\\nPrecio: $' + values[1]);
              }
            },
            {
              content: '<button style="padding: 6px 12px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Editar</button>',
              event: 'click',
              funct: function(row, index) {
                var values = Object.values(row);
                console.log('Editar producto:', values[0]);
              }
            },
            {
              content: '<button style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>',
              event: 'click',
              funct: function(row, index) {
                var values = Object.values(row);
                if (confirm('¿Eliminar ' + values[0] + '?')) {
                  gridie.removeRow(index);
                }
              }
            }
          ]
        },
        { 
          producto: "Teclado Mecánico Keychron K8",  // Posición 0
          precio: 85,                                 // Posición 1
          stock: 15,                                  // Posición 2
          disponible: true,                           // Posición 3
          acciones: [                                 // Posición 4
            {
              content: '<button style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Ver Detalles</button>',
              event: 'click',
              funct: function(row, index) {
                var values = Object.values(row);
                alert('Producto: ' + values[0] + '\\nPrecio: $' + values[1]);
              }
            },
            {
              content: '<button style="padding: 6px 12px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Editar</button>',
              event: 'click',
              funct: function(row, index) {
                var values = Object.values(row);
                console.log('Editar producto:', values[0]);
              }
            },
            {
              content: '<button style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>',
              event: 'click',
              funct: function(row, index) {
                var values = Object.values(row);
                if (confirm('¿Eliminar ' + values[0] + '?')) {
                  gridie.removeRow(index);
                }
              }
            }
          ]
        },
        {
          producto: "Monitor LG UltraWide 34\"",  // Posición 0
          precio: 450,                             // Posición 1
          stock: 0,                                // Posición 2
          disponible: false,                       // Posición 3
          acciones: [                              // Posición 4
            {
              content: '<button style="padding: 6px 12px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Agotado</button>',
              event: 'click',
              funct: function(row, index) {
                var values = Object.values(row);
                alert('Producto agotado: ' + values[0]);
              }
            }
          ]
        },
      ],
    });
  </script>
</body>
</html>`;