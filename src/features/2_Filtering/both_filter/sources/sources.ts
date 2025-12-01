// src/features/2_Filtering/both_filter/sources/sources.ts

export const tsCode = `import { Gridie } from './gridie';

const gridie = document.createElement("gridie-table") as Gridie;

// Valores predefinidos para Ciudad
const ciudadesDisponibles = ["Santo Domingo", "Santiago", "La Vega", "San Pedro", "Valverde"];

const config = {
  id: "tabla-filtros-combinados",
  headers: [
    // Sin filtros - solo ID
    {
      label: "ID",
      type: "number" as const,
      sortable: true,
    },
    
    // Header Filter con búsqueda + Filter Row
    {
      label: "Nombre",
      type: "string" as const,
      sortable: true,
      filters: {
        headerFilter: {
          visible: true,
          search: true,
          showCount: true,
        },
        filterRow: {
          visible: true,
          operators: ["contains", "equals", "startswith", "endswith"] as const,
        },
      },
    },
    
    // Header Filter con parameters + Filter Row
    {
      label: "Departamento",
      type: "string" as const,
      sortable: true,
      filters: {
        headerFilter: {
          visible: true,
          parameters: [
            {
              text: "🖥️ Departamentos Técnicos",
              operator: "in" as const,
              value: ["IT", "Desarrollo", "QA"],
            },
            {
              text: "💼 Departamentos de Negocio",
              operator: "in" as const,
              value: ["Ventas", "Marketing", "RRHH"],
            },
          ],
          values: ["IT", "Ventas", "Marketing", "RRHH", "Desarrollo", "QA", "Finanzas"],
        },
        filterRow: {
          visible: true,
          operators: ["equals", "notequals", "contains"] as const,
        },
      },
    },
    
    // Header Filter con rangos + Filter Row numérico
    {
      label: "Salario",
      type: "number" as const,
      sortable: true,
      filters: {
        headerFilter: {
          visible: true,
          parameters: [
            {
              text: "Junior (<$50k)",
              operator: "<" as const,
              value: 50000,
            },
            {
              text: "Mid ($50k - $65k)",
              operator: "between" as const,
              value: 50000,
              value2: 65000,
            },
            {
              text: "Senior ($65k+)",
              operator: ">=" as const,
              value: 65000,
            },
          ],
        },
        filterRow: {
          visible: true,
          operators: ["=", "<>", "<", ">", "<=", ">=", "between"] as const,
        },
      },
    },
    
    // Header Filter con values + Filter Row
    {
      label: "Ciudad",
      type: "string" as const,
      filters: {
        headerFilter: {
          visible: true,
          values: ciudadesDisponibles,
        },
        filterRow: {
          visible: true,
        },
      },
    },
    
    // Header Filter con jerarquía de fechas + Filter Row
    {
      label: "Fecha Ingreso",
      type: "date" as const,
      sortable: true,
      filters: {
        headerFilter: {
          visible: true,
          dateHierarchy: ["year", "month"] as const,
          parameters: [
            {
              text: "📅 Este año (2024)",
              operator: "year" as const,
              value: 2024,
            },
            {
              text: "📆 Últimos 6 meses",
              operator: "last" as const,
              value: 6,
              unit: "months" as const,
            },
          ],
        },
        filterRow: {
          visible: true,
          operators: ["=", "<>", "<", ">", "<=", ">=", "between"] as const,
        },
      },
    },
    
    // Boolean con ambos filtros
    {
      label: "Activo",
      type: "boolean" as const,
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
  body: [
    { 
      id: 1, nombre: "Juan Pérez", departamento: "IT", salario: 45000, 
      ciudad: "Santo Domingo", fechaIngreso: "2020-03-15", activo: true 
    },
    { 
      id: 2, nombre: "María García", departamento: "Ventas", salario: 52000, 
      ciudad: "Santiago", fechaIngreso: "2019-07-22", activo: true 
    },
    { 
      id: 3, nombre: "Carlos López", departamento: "IT", salario: 48000, 
      ciudad: "La Vega", fechaIngreso: "2021-01-10", activo: true 
    },
    { 
      id: 4, nombre: "Ana Martínez", departamento: "Marketing", salario: 55000, 
      ciudad: "Santo Domingo", fechaIngreso: "2018-11-05", activo: false 
    },
    { 
      id: 5, nombre: "Pedro Rodríguez", departamento: "RRHH", salario: 50000, 
      ciudad: "San Pedro", fechaIngreso: "2020-09-18", activo: true 
    },
    { 
      id: 6, nombre: "Laura Fernández", departamento: "IT", salario: 68000, 
      ciudad: "Santo Domingo", fechaIngreso: "2019-04-30", activo: true 
    },
    { 
      id: 7, nombre: "Miguel Sánchez", departamento: "Ventas", salario: 47000, 
      ciudad: "Santiago", fechaIngreso: "2021-06-12", activo: true 
    },
    { 
      id: 8, nombre: "Isabel Torres", departamento: "Marketing", salario: 53000, 
      ciudad: "La Vega", fechaIngreso: "2020-02-25", activo: true 
    },
    { 
      id: 9, nombre: "Roberto Gómez", departamento: "Desarrollo", salario: 72000, 
      ciudad: "Santo Domingo", fechaIngreso: "2018-03-10", activo: true 
    },
    { 
      id: 10, nombre: "Carmen Díaz", departamento: "QA", salario: 58000, 
      ciudad: "Santiago", fechaIngreso: "2019-08-15", activo: false 
    },
    { 
      id: 11, nombre: "Francisco Ruiz", departamento: "IT", salario: 44000, 
      ciudad: "Valverde", fechaIngreso: "2022-01-08", activo: true 
    },
    { 
      id: 12, nombre: "Patricia Moreno", departamento: "Finanzas", salario: 75000, 
      ciudad: "San Pedro", fechaIngreso: "2020-05-20", activo: true 
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

// Valores predefinidos para Ciudad
const ciudadesDisponibles = ["Santo Domingo", "Santiago", "La Vega", "San Pedro", "Valverde"];

const config = {
  id: "tabla-filtros-combinados",
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
          parameters: [
            {
              text: "🖥️ Departamentos Técnicos",
              operator: "in",
              value: ["IT", "Desarrollo", "QA"],
            },
            {
              text: "💼 Departamentos de Negocio",
              operator: "in",
              value: ["Ventas", "Marketing", "RRHH"],
            },
          ],
          values: ["IT", "Ventas", "Marketing", "RRHH", "Desarrollo", "QA", "Finanzas"],
        },
        filterRow: {
          visible: true,
          operators: ["equals", "notequals", "contains"],
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
            {
              text: "Junior (<$50k)",
              operator: "<",
              value: 50000,
            },
            {
              text: "Mid ($50k - $65k)",
              operator: "between",
              value: 50000,
              value2: 65000,
            },
            {
              text: "Senior ($65k+)",
              operator: ">=",
              value: 65000,
            },
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
          values: ciudadesDisponibles,
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
          parameters: [
            {
              text: "📅 Este año (2024)",
              operator: "year",
              value: 2024,
            },
            {
              text: "📆 Últimos 6 meses",
              operator: "last",
              value: 6,
              unit: "months",
            },
          ],
        },
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
  body: [
    { id: 1, nombre: "Juan Pérez", departamento: "IT", salario: 45000, ciudad: "Santo Domingo", fechaIngreso: "2020-03-15", activo: true },
    { id: 2, nombre: "María García", departamento: "Ventas", salario: 52000, ciudad: "Santiago", fechaIngreso: "2019-07-22", activo: true },
    { id: 3, nombre: "Carlos López", departamento: "IT", salario: 48000, ciudad: "La Vega", fechaIngreso: "2021-01-10", activo: true },
    { id: 4, nombre: "Ana Martínez", departamento: "Marketing", salario: 55000, ciudad: "Santo Domingo", fechaIngreso: "2018-11-05", activo: false },
    { id: 5, nombre: "Pedro Rodríguez", departamento: "RRHH", salario: 50000, ciudad: "San Pedro", fechaIngreso: "2020-09-18", activo: true },
    { id: 6, nombre: "Laura Fernández", departamento: "IT", salario: 68000, ciudad: "Santo Domingo", fechaIngreso: "2019-04-30", activo: true },
    { id: 7, nombre: "Miguel Sánchez", departamento: "Ventas", salario: 47000, ciudad: "Santiago", fechaIngreso: "2021-06-12", activo: true },
    { id: 8, nombre: "Isabel Torres", departamento: "Marketing", salario: 53000, ciudad: "La Vega", fechaIngreso: "2020-02-25", activo: true },
    { id: 9, nombre: "Roberto Gómez", departamento: "Desarrollo", salario: 72000, ciudad: "Santo Domingo", fechaIngreso: "2018-03-10", activo: true },
    { id: 10, nombre: "Carmen Díaz", departamento: "QA", salario: 58000, ciudad: "Santiago", fechaIngreso: "2019-08-15", activo: false },
    { id: 11, nombre: "Francisco Ruiz", departamento: "IT", salario: 44000, ciudad: "Valverde", fechaIngreso: "2022-01-08", activo: true },
    { id: 12, nombre: "Patricia Moreno", departamento: "Finanzas", salario: 75000, ciudad: "San Pedro", fechaIngreso: "2020-05-20", activo: true },
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
  <title>Gridie - Filtros Combinados (Header + Row)</title>
</head>
<body>
  <h1>Gridie - Filtros Combinados Demo</h1>
  <p>Esta demo muestra cómo Header Filter y Filter Row trabajan juntos con lógica AND.</p>
  <div id="dataTable"></div>

  <script type="module" src="./index.js"></script>
</body>
</html>
`;