export const typescriptCode = `import { Gridie } from "./gridie/gridie";

// Generar 100 empleados de ejemplo
function generateData(count: number) {
  const departments = ["IT", "HR", "Sales", "Marketing", "Finance", "Development", "QA"];
  const cities = ["Santo Domingo", "Santiago", "La Vega", "San Pedro", "Puerto Plata"];
  const names = ["Juan", "María", "Carlos", "Ana", "Pedro", "Laura", "Miguel", "Isabel"];
  const lastNames = ["Pérez", "García", "López", "Martínez", "Rodríguez", "Fernández"];
  
  const data = [];

  for (let i = 1; i <= count; i++) {
    const year = 2018 + Math.floor(Math.random() * 7);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

    data.push({
      id: i,
      name: \`\${names[Math.floor(Math.random() * names.length)]} \${lastNames[Math.floor(Math.random() * lastNames.length)]}\`,
      department: departments[Math.floor(Math.random() * departments.length)],
      salary: Math.floor(Math.random() * 50000) + 35000,
      city: cities[Math.floor(Math.random() * cities.length)],
      hireDate: \`\${year}-\${month}-\${day}\`,
      age: Math.floor(Math.random() * 35) + 25,
      active: Math.random() > 0.2,
    });
  }

  return data;
}

const data = generateData(100);

const gridie = new Gridie({
  id: "tabla-paginacion-filtros",
  headers: [
    {
      label: "ID",
      type: "number",
      sortable: true,
    },
    {
      label: "Nombre",
      type: "string",
      sortable: true,
      filters: {
        headerFilter: {
          visible: true,
          search: true,
          showCount: true,
        },
        filterRow: {
          visible: true,
          operators: ["contains", "equals", "startswith", "endswith"],
        },
      },
    },
    {
      label: "Departamento",
      type: "string",
      sortable: true,
      filters: {
        headerFilter: {
          visible: true,
          showCount: true,
        },
        filterRow: {
          visible: true,
        },
      },
    },
    {
      label: "Salario",
      type: "number",
      sortable: true,
      filters: {
        headerFilter: {
          visible: true,
          parameters: [
            { text: "Junior (<$50k)", operator: "<", value: 50000 },
            { text: "Mid ($50k - $65k)", operator: "between", value: 50000, value2: 65000 },
            { text: "Senior ($65k+)", operator: ">=", value: 65000 },
          ],
        },
        filterRow: {
          visible: true,
          operators: ["=", "<>", "<", ">", "<=", ">=", "between"],
        },
      },
    },
    {
      label: "Ciudad",
      type: "string",
      filters: {
        headerFilter: {
          visible: true,
          showCount: true,
        },
        filterRow: {
          visible: true,
        },
      },
    },
    {
      label: "Fecha Ingreso",
      type: "date",
      sortable: true,
      filters: {
        headerFilter: {
          visible: true,
          dateHierarchy: ["year", "month"],
        },
        filterRow: {
          visible: true,
          operators: ["=", "<>", "<", ">", "<=", ">=", "between"],
        },
      },
    },
    {
      label: "Edad",
      type: "number",
      sortable: true,
      filters: {
        filterRow: {
          visible: true,
          operators: ["=", "<>", "<", ">", "<=", ">=", "between"],
        },
      },
    },
    {
      label: "Activo",
      type: "boolean",
      filters: {
        headerFilter: {
          visible: true,
        },
        filterRow: {
          visible: true,
        },
      },
    },
  ],
  body: data,
  enableSort: true,
  enableFilter: true,
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
});

document.getElementById("table")?.appendChild(gridie);

// ========== PANEL DE ESTADO ==========
function updateInfoPanel() {
  const totalFiltered = gridie.getTotalItems();
  const currentPage = gridie.getCurrentPage();
  const totalPages = gridie.getTotalPages();
  const pageSize = gridie.getPageSize();
  
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalFiltered);
  
  console.log(\`Mostrando \${start}-\${end} de \${totalFiltered} items (Página \${currentPage}/\${totalPages})\`);
}

// Actualizar panel al cambiar de página
gridie.addEventListener("pagechange", () => {
  updateInfoPanel();
});

// Inicializar
updateInfoPanel();

// ========== EJEMPLO: APLICAR FILTROS PROGRAMÁTICAMENTE ==========
// Nota: En la UI se hace mediante los controles de la tabla

// Para limpiar todos los filtros y resetear:
function clearAllFilters() {
  gridie.setData({
    headers: gridie.headers,
    data: data,
  });
}`;

export const javascriptCode = `const data = generateData(100);

const gridie = new Gridie({
  id: "tabla-paginacion-filtros",
  headers: [
    {
      label: "ID",
      type: "number",
      sortable: true,
    },
    {
      label: "Nombre",
      type: "string",
      sortable: true,
      filters: {
        headerFilter: {
          visible: true,
          search: true,
          showCount: true,
        },
        filterRow: {
          visible: true,
          operators: ["contains", "equals", "startswith", "endswith"],
        },
      },
    },
    {
      label: "Departamento",
      type: "string",
      sortable: true,
      filters: {
        headerFilter: {
          visible: true,
          showCount: true,
        },
        filterRow: {
          visible: true,
        },
      },
    },
    {
      label: "Salario",
      type: "number",
      sortable: true,
      filters: {
        headerFilter: {
          visible: true,
          parameters: [
            { text: "Junior (<$50k)", operator: "<", value: 50000 },
            { text: "Mid ($50k - $65k)", operator: "between", value: 50000, value2: 65000 },
            { text: "Senior ($65k+)", operator: ">=", value: 65000 },
          ],
        },
        filterRow: {
          visible: true,
          operators: ["=", "<>", "<", ">", "<=", ">=", "between"],
        },
      },
    },
    // ... más columnas
  ],
  body: data,
  enableSort: true,
  enableFilter: true,
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
      },
    },
    position: "bottom",
  },
});

document.getElementById("table").appendChild(gridie);

// Escuchar cambios de página
gridie.addEventListener("pagechange", (e) => {
  console.log("Página:", e.detail.page);
  console.log("Total items:", e.detail.totalItems);
  console.log("Total páginas:", e.detail.totalPages);
});

// Métodos disponibles
console.log("Página actual:", gridie.getCurrentPage());
console.log("Total páginas:", gridie.getTotalPages());
console.log("Items totales:", gridie.getTotalItems());`;

export const htmlCode = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Paginación con Filtros - Gridie</title>
</head>
<body>
  <h1>Paginación + Filtros Avanzados</h1>
  
  <div id="info" style="background: #f0f0f0; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
    <h3>📊 Estado Actual:</h3>
    <div id="infoPanel" style="font-family: monospace;">
      <div>Total empleados: <strong id="totalOriginal">100</strong></div>
      <div>Empleados filtrados: <strong id="totalFiltered">100</strong></div>
      <div>Página actual: <strong id="currentPage">1</strong></div>
      <div>Total páginas: <strong id="totalPages">10</strong></div>
    </div>
  </div>

  <div id="table"></div>

  <script type="module">
    import { Gridie } from './gridie.js';
    
    // Generar datos
    function generateData(count) {
      const data = [];
      const departments = ["IT", "HR", "Sales", "Marketing", "Finance"];
      const cities = ["Santo Domingo", "Santiago", "La Vega"];
      
      for (let i = 1; i <= count; i++) {
        data.push({
          id: i,
          name: \`Employee \${i}\`,
          department: departments[Math.floor(Math.random() * departments.length)],
          salary: Math.floor(Math.random() * 50000) + 35000,
          city: cities[Math.floor(Math.random() * cities.length)],
          age: Math.floor(Math.random() * 35) + 25,
          active: Math.random() > 0.2,
        });
      }
      return data;
    }
    
    const data = generateData(100);
    
    const gridie = new Gridie({
      id: "tabla-paginacion-filtros",
      headers: [
        { label: "ID", type: "number", sortable: true },
        { 
          label: "Nombre", 
          type: "string", 
          sortable: true,
          filters: {
            headerFilter: { visible: true, search: true },
            filterRow: { visible: true }
          }
        },
        { 
          label: "Departamento", 
          type: "string",
          filters: {
            headerFilter: { visible: true },
            filterRow: { visible: true }
          }
        },
        { 
          label: "Salario", 
          type: "number",
          filters: {
            headerFilter: {
              visible: true,
              parameters: [
                { text: "Junior (<$50k)", operator: "<", value: 50000 },
                { text: "Senior ($65k+)", operator: ">=", value: 65000 }
              ]
            },
            filterRow: { 
              visible: true,
              operators: ["=", "<", ">", "<=", ">=", "between"]
            }
          }
        },
        { label: "Ciudad", type: "string" },
        { label: "Edad", type: "number" },
        { label: "Activo", type: "boolean" },
      ],
      body: data,
      enableSort: true,
      enableFilter: true,
      paging: {
        enabled: true,
        pageSize: {
          default: 10,
          options: [10, 25, 50, 100]
        },
        showInfo: true,
        navigation: {
          visible: true,
          maxButtons: 5
        }
      }
    });
    
    document.getElementById('table').appendChild(gridie);
    
    // Actualizar panel de info
    function updateInfo() {
      document.getElementById('totalFiltered').textContent = gridie.getTotalItems();
      document.getElementById('currentPage').textContent = gridie.getCurrentPage();
      document.getElementById('totalPages').textContent = gridie.getTotalPages();
    }
    
    gridie.addEventListener('pagechange', updateInfo);
    updateInfo();
  </script>
</body>
</html>`;