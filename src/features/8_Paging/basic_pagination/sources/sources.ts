// src/features/8_Paging/basic_pagination/sources/sources.ts

export const tsCode = `import { Gridie } from './gridie';

// Generar 100 empleados de prueba
const generateData = (count: number) => {
  const departments = ['IT', 'Ventas', 'Marketing', 'RRHH', 'Finanzas'];
  const names = ['Juan', 'María', 'Pedro', 'Ana', 'Luis', 'Carmen'];
  const lastNames = ['Pérez', 'García', 'López', 'Martínez', 'Rodríguez'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    nombre: \`\${names[i % names.length]} \${lastNames[i % lastNames.length]}\`,
    departamento: departments[i % departments.length],
    salario: 30000 + (i * 1000),
    edad: 25 + (i % 40),
  }));
};

const gridie = document.createElement("gridie-table") as Gridie;

const config = {
  id: "tabla-paginacion-basica",
  headers: [
    { label: "ID", type: "number" as const, sortable: true },
    { label: "Nombre", type: "string" as const, sortable: true },
    { label: "Departamento", type: "string" as const, sortable: true },
    { label: "Salario", type: "number" as const, sortable: true },
    { label: "Edad", type: "number" as const, sortable: true },
  ],
  body: generateData(100),
  
  mode: "client" as const,
  enableSort: true,
  language: "es" as const,
  
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
        position: "inline" as const,
        buttonText: "→",
      },
    },
    
    position: "bottom" as const,
  },
};

gridie.setConfig(config);
document.getElementById("dataTable")?.appendChild(gridie);

// Métodos públicos disponibles:
// gridie.goToPage(5);           // Ir a página específica
// gridie.nextPage();            // Página siguiente
// gridie.previousPage();        // Página anterior
// gridie.firstPage();           // Primera página
// gridie.lastPage();            // Última página
// gridie.setPageSize(25);       // Cambiar tamaño de página
// gridie.getCurrentPage();      // Obtener página actual
// gridie.getTotalPages();       // Obtener total de páginas
// gridie.getPageSize();         // Obtener tamaño actual
// gridie.getTotalItems();       // Obtener total de items
`;

export const jsCode = `import { Gridie } from './gridie';

// Generar 100 empleados de prueba
const generateData = (count) => {
  const departments = ['IT', 'Ventas', 'Marketing', 'RRHH', 'Finanzas'];
  const names = ['Juan', 'María', 'Pedro', 'Ana', 'Luis', 'Carmen'];
  const lastNames = ['Pérez', 'García', 'López', 'Martínez', 'Rodríguez'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    nombre: \`\${names[i % names.length]} \${lastNames[i % lastNames.length]}\`,
    departamento: departments[i % departments.length],
    salario: 30000 + (i * 1000),
    edad: 25 + (i % 40),
  }));
};

const gridie = document.createElement("gridie-table");

const config = {
  id: "tabla-paginacion-basica",
  headers: [
    { label: "ID", type: "number", sortable: true },
    { label: "Nombre", type: "string", sortable: true },
    { label: "Departamento", type: "string", sortable: true },
    { label: "Salario", type: "number", sortable: true },
    { label: "Edad", type: "number", sortable: true },
  ],
  body: generateData(100),
  
  mode: "client",
  enableSort: true,
  language: "es",
  
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
};

gridie.setConfig(config);
document.getElementById("dataTable")?.appendChild(gridie);
`;

export const htmlCode = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gridie - Paginación Básica</title>
</head>
<body>
  <h1>Gridie - Paginación Básica Demo</h1>
  <p>Sistema completo de paginación con 100 registros.</p>
  <div id="dataTable"></div>

  <script type="module" src="./index.js"></script>
</body>
</html>
`;