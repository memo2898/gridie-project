export const typescriptCode = `import { Gridie } from "./gridie/gridie";

// ========== GENERAR DATOS ==========
function generateEmployeeData(count: number) {
  const departments = ["IT", "HR", "Sales", "Marketing", "Finance", "Development", "QA", "Support"];
  const cities = ["Santo Domingo", "Santiago", "La Vega", "San Pedro", "Puerto Plata"];
  const names = ["Juan", "María", "Carlos", "Ana", "Pedro", "Laura", "Miguel", "Isabel"];
  const lastNames = ["Pérez", "García", "López", "Martínez", "Rodríguez", "Fernández"];
  
  const data = [];

  for (let i = 1; i <= count; i++) {
    const year = 2018 + Math.floor(Math.random() * 7);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

    data.push({
      employeeId: \`EMP\${String(i).padStart(4, '0')}\`,
      fullName: \`\${names[Math.floor(Math.random() * names.length)]} \${lastNames[Math.floor(Math.random() * lastNames.length)]}\`,
      department: departments[Math.floor(Math.random() * departments.length)],
      salary: Math.floor(Math.random() * 60000) + 30000,
      city: cities[Math.floor(Math.random() * cities.length)],
      hireDate: \`\${year}-\${month}-\${day}\`,
      age: Math.floor(Math.random() * 35) + 25,
      active: Math.random() > 0.15,
      performance: Math.floor(Math.random() * 5) + 1,
    });
  }

  return data;
}

const data = generateEmployeeData(500);

// ========== CREAR TABLA ==========
const gridie = new Gridie({
  id: "complete-example",
  identityField: "employeeId", // ✅ Campo único para CRUD
  headers: [
    {
      label: "ID Empleado",
      type: "string",
      sortable: true,
      filters: {
        headerFilter: { visible: true, search: true },
        filterRow: { visible: true }
      }
    },
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
      sortable: true,
      filters: {
        headerFilter: { visible: true },
        filterRow: { visible: true }
      }
    },
    {
      label: "Salario",
      type: "number",
      sortable: true,
      filters: {
        headerFilter: {
          visible: true,
          parameters: [
            { text: "Entry ($30k-$45k)", operator: "between", value: 30000, value2: 45000 },
            { text: "Mid ($45k-$65k)", operator: "between", value: 45000, value2: 65000 },
            { text: "Senior ($65k+)", operator: ">=", value: 65000 }
          ]
        },
        filterRow: {
          visible: true,
          operators: ["=", "<>", "<", ">", "<=", ">=", "between"]
        }
      }
    },
    {
      label: "Ciudad",
      type: "string",
      filters: {
        headerFilter: { visible: true },
        filterRow: { visible: true }
      }
    },
    {
      label: "Fecha Ingreso",
      type: "date",
      sortable: true,
      filters: {
        headerFilter: {
          visible: true,
          dateHierarchy: ["year", "month", "day"]
        },
        filterRow: { visible: true }
      }
    },
    {
      label: "Edad",
      type: "number",
      sortable: true,
      filters: {
        filterRow: {
          visible: true,
          operators: ["=", "<>", "<", ">", "<=", ">="]
        }
      }
    },
    {
      label: "Activo",
      type: "boolean",
      filters: {
        headerFilter: { visible: true },
        filterRow: { visible: true }
      }
    },
    {
      label: "Rendimiento",
      type: "number"
    },
    "Acciones" // ✅ Columna de acciones HTML
  ],
  body: data.map(emp => ({
    ...emp,
    performance: "⭐".repeat(emp.performance),
    actions: [
      {
        content: '<button class="btn-view">👁️ Ver</button>',
        event: "click",
        funct: (row: any) => {
          alert(\`Ver: \${row.fullName} (\${row.employeeId})\`);
        }
      },
      {
        content: '<button class="btn-edit">✏️ Editar</button>',
        event: "click",
        funct: (row: any) => {
          const newSalary = prompt("Nuevo salario:", row.salary);
          if (newSalary) {
            gridie.updateRowByIdentity(row.employeeId, {
              salary: Number(newSalary)
            });
          }
        }
      },
      {
        content: '<button class="btn-delete">🗑️ Eliminar</button>',
        event: "click",
        funct: (row: any) => {
          if (confirm(\`¿Eliminar a \${row.fullName}?\`)) {
            gridie.removeRowByIdentity(row.employeeId);
          }
        }
      }
    ]
  })),
  enableSort: true,
  enableFilter: true,
  language: "es",
  paging: {
    enabled: true,
    pageSize: {
      visible: true,
      default: 10,
      options: [10, 25, 50, 100]
    },
    showInfo: true,
    navigation: {
      visible: true,
      maxButtons: 7,
      jumpTo: {
        visible: true,
        position: "inline"
      }
    },
    position: "bottom"
  }
});

document.getElementById("table")?.appendChild(gridie);

// ========== MÉTODOS PÚBLICOS ==========

// Agregar empleado con validación
function addEmployee() {
  const newId = \`EMP\${Math.floor(Math.random() * 9000) + 1000}\`;
  const added = gridie.addRow({
    employeeId: newId,
    fullName: "Nuevo Empleado",
    department: "IT",
    salary: 50000,
    city: "Santo Domingo",
    hireDate: new Date().toISOString().split('T')[0],
    age: 30,
    active: true,
    performance: "⭐⭐⭐⭐",
    actions: [/* ... botones ... */]
  });

  if (!added) {
    alert("❌ Error: ID duplicado");
  }
}

// Obtener empleado por ID
const employee = gridie.getRowByIdentity("EMP0001");
console.log(employee);

// Verificar existencia
if (gridie.hasRowByIdentity("EMP0001")) {
  console.log("Empleado existe");
}

// Actualizar empleado
gridie.updateRowByIdentity("EMP0001", {
  salary: 75000,
  department: "Management"
});

// Eliminar empleado
gridie.removeRowByIdentity("EMP0001");

// Limpiar filtros
gridie.clearAllFilters();

// Navegación
gridie.nextPage();
gridie.previousPage();
gridie.goToPage(5);

// Obtener estado
console.log("Página actual:", gridie.getCurrentPage());
console.log("Total páginas:", gridie.getTotalPages());
console.log("Items totales:", gridie.getTotalItems());
console.log("Body actual:", gridie.getBody());

// Eventos
gridie.addEventListener("pagechange", (e: CustomEvent) => {
  console.log("Página:", e.detail.page);
  console.log("Total items:", e.detail.totalItems);
});`;

export const javascriptCode = `// Generar 500 empleados
const data = generateEmployeeData(500);

const gridie = new Gridie({
  id: "complete-example",
  identityField: "employeeId",
  headers: [
    { label: "ID", type: "string", sortable: true },
    { label: "Nombre", type: "string", sortable: true },
    { label: "Departamento", type: "string", sortable: true },
    { label: "Salario", type: "number", sortable: true },
    { label: "Ciudad", type: "string" },
    { label: "Fecha", type: "date", sortable: true },
    { label: "Edad", type: "number", sortable: true },
    { label: "Activo", type: "boolean" },
    { label: "Rendimiento", type: "number" },
    "Acciones"
  ],
  body: data.map(emp => ({
    ...emp,
    performance: "⭐".repeat(emp.performance),
    actions: [
      {
        content: '<button>👁️ Ver</button>',
        event: "click",
        funct: (row) => alert(\`Ver: \${row.fullName}\`)
      },
      {
        content: '<button>✏️ Editar</button>',
        event: "click",
        funct: (row) => {
          const salary = prompt("Nuevo salario:");
          if (salary) {
            gridie.updateRowByIdentity(row.employeeId, {
              salary: Number(salary)
            });
          }
        }
      },
      {
        content: '<button>🗑️ Eliminar</button>',
        event: "click",
        funct: (row) => {
          if (confirm("¿Eliminar?")) {
            gridie.removeRowByIdentity(row.employeeId);
          }
        }
      }
    ]
  })),
  paging: {
    enabled: true,
    pageSize: { default: 10, options: [10, 25, 50, 100] },
    navigation: { visible: true, maxButtons: 7 }
  }
});

document.getElementById("table").appendChild(gridie);`;

export const htmlCode = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Example - Gridie v1.0</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .btn-view, .btn-edit, .btn-delete {
      padding: 6px 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      margin-right: 4px;
    }
    
    .btn-view { background: #667eea; color: white; }
    .btn-edit { background: #f59e0b; color: white; }
    .btn-delete { background: #ef4444; color: white; }
    
    .stats {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
    }
  </style>
</head>
<body>
  <h1>🎯 Complete Example - Gridie v1.0</h1>
  
  <div class="stats">
    <div>Total: <strong id="total">500</strong></div>
    <div>Filtrados: <strong id="filtered">500</strong></div>
    <div>Página: <strong id="page">1</strong></div>
    <div>Mostrando: <strong id="showing">1-10</strong></div>
  </div>

  <div id="table"></div>

  <script type="module">
    import { Gridie } from './gridie.js';
    
    // Función de generación de datos
    function generateEmployeeData(count) {
      const data = [];
      const departments = ["IT", "HR", "Sales", "Marketing"];
      const cities = ["Santo Domingo", "Santiago", "La Vega"];
      
      for (let i = 1; i <= count; i++) {
        data.push({
          employeeId: \`EMP\${String(i).padStart(4, '0')}\`,
          fullName: \`Employee \${i}\`,
          department: departments[Math.floor(Math.random() * departments.length)],
          salary: Math.floor(Math.random() * 60000) + 30000,
          city: cities[Math.floor(Math.random() * cities.length)],
          hireDate: \`2020-01-\${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}\`,
          age: Math.floor(Math.random() * 35) + 25,
          active: Math.random() > 0.2,
          performance: Math.floor(Math.random() * 5) + 1,
        });
      }
      return data;
    }
    
    const data = generateEmployeeData(500);
    
    const gridie = new Gridie({
      id: "complete-example",
      identityField: "employeeId",
      headers: [
        { label: "ID", type: "string", sortable: true },
        { label: "Nombre", type: "string", sortable: true },
        { label: "Depto", type: "string", sortable: true },
        { label: "Salario", type: "number", sortable: true },
        { label: "Ciudad", type: "string" },
        { label: "Fecha", type: "date", sortable: true },
        { label: "Edad", type: "number" },
        { label: "Activo", type: "boolean" },
        "Acciones"
      ],
      body: data.map(emp => ({
        ...emp,
        actions: [
          {
            content: '<button class="btn-view">Ver</button>',
            event: "click",
            funct: (row) => alert(\`Ver: \${row.fullName}\`)
          },
          {
            content: '<button class="btn-edit">Edit</button>',
            event: "click",
            funct: (row) => {
              const salary = prompt("Nuevo salario:", row.salary);
              if (salary) {
                gridie.updateRowByIdentity(row.employeeId, {
                  salary: Number(salary)
                });
              }
            }
          },
          {
            content: '<button class="btn-delete">Del</button>',
            event: "click",
            funct: (row) => {
              if (confirm("¿Eliminar?")) {
                gridie.removeRowByIdentity(row.employeeId);
              }
            }
          }
        ]
      })),
      paging: {
        enabled: true,
        pageSize: { default: 10, options: [10, 25, 50] }
      }
    });
    
    document.getElementById('table').appendChild(gridie);
    
    function updateStats() {
      document.getElementById('filtered').textContent = gridie.getTotalItems();
      document.getElementById('page').textContent = gridie.getCurrentPage();
      const pageSize = gridie.getPageSize();
      const page = gridie.getCurrentPage();
      const total = gridie.getTotalItems();
      const start = (page - 1) * pageSize + 1;
      const end = Math.min(page * pageSize, total);
      document.getElementById('showing').textContent = \`\${start}-\${end}\`;
    }
    
    gridie.addEventListener('pagechange', updateStats);
    updateStats();
  </script>
</body>
</html>`;