// src/features/4_FilterRow/sources/sources.ts

export const tsCode = `import { Gridie } from './gridie';

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
          operators: ["=", "<>", "<", ">", "<=", ">=", "between"]
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
          operators: ["contains", "equals", "startswith"]
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
  ],
  enableSort: true,
  language: "es" as const,
};

gridie.setConfig(config);
document.getElementById("dataTable")?.appendChild(gridie);
`;

export const jsCode = `import { Gridie } from './gridie';

const gridie = document.createElement("gridie-table");

const config = {
  id: "tabla-empleados-filtros",
  headers: [
    {
      label: "ID",
      type: "number",
      filters: {
        filterRow: {
          visible: true,
          operators: ["=", "<>", "<", ">", "<=", ">=", "between"]
        }
      }
    },
    {
      label: "Nombre",
      type: "string",
      filters: {
        filterRow: {
          visible: true,
        }
      }
    },
    {
      label: "Departamento",
      type: "string",
      filters: {
        filterRow: {
          visible: true,
          operators: ["contains", "equals", "startswith"]
        }
      }
    },
    {
      label: "Salario",
      type: "number",
      filters: {
        filterRow: {
          visible: true,
        }
      }
    },
    {
      label: "Fecha Ingreso",
      type: "date",
      filters: {
        filterRow: {
          visible: true,
        }
      }
    },
    {
      label: "Activo",
      type: "boolean",
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
  ],
  enableSort: true,
  language: "es",
};

gridie.setConfig(config);
document.getElementById("dataTable")?.appendChild(gridie);
`;

export const htmlCode = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gridie - FilterRow Demo</title>
</head>
<body>
  <h1>Gridie FilterRow Demo</h1>
  <div id="dataTable"></div>

  <script type="module" src="./index.js"></script>
</body>
</html>
`;