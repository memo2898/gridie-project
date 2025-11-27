// src/features/3_Sorting/sources/sources.ts

export const tsCode = `import { Gridie } from './gridie';

// Crear elemento
const gridie = document.createElement('gridie-table') as Gridie;

// Configurar con datos de empleados
gridie.setConfig({
  id: "tabla-empleados",
  headers: [
    { label: "ID", type: "number" },      // Posición 0
    "Nombre",                              // Posición 1
    "Departamento",                        // Posición 2
    { label: "Salario", type: "number" }, // Posición 3
    { label: "Fecha Ingreso", type: "date" }, // Posición 4
    { label: "Activo", type: "boolean" }  // Posición 5
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
    }
  ],
  enableSort: true,  // Habilitar ordenamiento
  language: 'es'
});

// Agregar al DOM
document.body.appendChild(gridie);

// INSTRUCCIONES DE USO:
// 1. Click en cualquier header para ordenar: ninguno → ASC → DESC → ninguno
// 2. Click derecho en header para ver menú contextual
// 3. Ordenar por múltiples columnas simultáneamente
// 4. Los números indican el orden de aplicación del sort`;

export const jsCode = `// Crear elemento
const gridie = document.createElement('gridie-table');

// Configurar con datos de empleados
gridie.setConfig({
  id: "tabla-empleados",
  headers: [
    { label: "ID", type: "number" },
    "Nombre",
    "Departamento",
    { label: "Salario", type: "number" },
    { label: "Fecha Ingreso", type: "date" },
    { label: "Activo", type: "boolean" }
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
    }
  ],
  enableSort: true,
  language: 'es'
});

// Agregar al DOM
document.body.appendChild(gridie);

// INSTRUCCIONES:
// - Click en header: Ordenar ASC/DESC
// - Click derecho: Menú contextual
// - Multi-column sorting soportado`;

export const htmlCode = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gridie - Sorting Feature</title>
  <script src="gridie.js"></script>
</head>
<body>
  <h1>Gridie con Ordenamiento (Sorting)</h1>
  <p><strong>Instrucciones:</strong></p>
  <ul>
    <li>Click en cualquier columna para ordenar</li>
    <li>Click derecho para ver opciones avanzadas</li>
    <li>Soporta ordenamiento de múltiples columnas</li>
  </ul>
  
  <gridie-table id="mi-tabla"></gridie-table>

  <script>
    const gridie = document.getElementById('mi-tabla');
    
    gridie.setConfig({
      id: "tabla-empleados",
      headers: [
        { label: "ID", type: "number" },
        "Nombre",
        "Departamento",
        { label: "Salario", type: "number" },
        { label: "Fecha Ingreso", type: "date" },
        { label: "Activo", type: "boolean" }
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
      language: 'es'
    });
  </script>

  <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 5px;">
    <h3>Características de Sorting:</h3>
    <ul>
      <li><strong>Click simple:</strong> Cicla entre Sin orden → ASC → DESC</li>
      <li><strong>Click derecho:</strong> Menú con opciones de ordenamiento</li>
      <li><strong>Multi-columna:</strong> Ordena por varias columnas a la vez</li>
      <li><strong>Indicadores:</strong> Flechas ▲▼ y números de orden</li>
      <li><strong>Tipos soportados:</strong> text, number, date, boolean</li>
    </ul>
  </div>
</body>
</html>`;