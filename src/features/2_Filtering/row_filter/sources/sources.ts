// src/features/2_Filtering/header_filter/sources/sources.ts

export const tsCode = `import { Gridie } from './gridie';

const gridie = document.createElement("gridie-table") as Gridie;

// Simular valores desde "BD" para Ciudad
const ciudadesDesdeDB = ["Santo Domingo", "Santiago", "La Vega", "San Pedro"];

const config = {
  id: "tabla-header-filter",
  headers: [
    // CASO 1: Sin Header Filter
    {
      label: "ID",
      type: "number" as const,
      sortable: true,
    },
    
    // CASO 2: Valores automáticos + búsqueda + sin contador
    {
      label: "Nombre",
      type: "string" as const,
      sortable: true,
      filters: {
        headerFilter: {
          visible: true,
          search: true,           // Búsqueda interna
          showCount: false,       // Ocultar contador
        },
      },
    },
    
    // CASO 3: Valores automáticos con contador
    {
      label: "Email",
      type: "string" as const,
      filters: {
        headerFilter: {
          visible: true,
          // showCount: true por defecto
        },
      },
    },
    
    // CASO 4: Parameters + Values (con separador)
    {
      label: "Departamento",
      type: "string" as const,
      sortable: true,
      filters: {
        headerFilter: {
          visible: true,
          parameters: [
            {
              text: "🖥️ Técnicos",
              operator: "in" as const,
              value: ["IT", "Desarrollo", "QA"],
            },
            {
              text: "💼 Negocio",
              operator: "in" as const,
              value: ["Ventas", "Marketing", "RRHH"],
            },
          ],
          values: ["IT", "Ventas", "Marketing", "RRHH", "Desarrollo", "QA", "Finanzas"],
        },
      },
    },
    
    // CASO 5: Solo Parameters con rangos
    {
      label: "Salario",
      type: "number" as const,
      sortable: true,
      filters: {
        filterRow: {
          visible: true, // CASO 17: Combinado con Header Filter
        },
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
      },
    },
    
    // CASO 6: Values desde "BD"
    {
      label: "Ciudad",
      type: "string" as const,
      filters: {
        headerFilter: {
          visible: true,
          values: ciudadesDesdeDB,
        },
      },
    },
    
    // CASO 7: Boolean automático
    {
      label: "Activo",
      type: "boolean" as const,
      filters: {
        headerFilter: {
          visible: true,
        },
      },
    },
  ],
  body: [
    { id: 1, nombre: "Juan Pérez", email: "juan@empresa.com", departamento: "IT", salario: 45000, ciudad: "Santo Domingo", activo: true },
    { id: 2, nombre: "María García", email: "maria@empresa.com", departamento: "Ventas", salario: 52000, ciudad: "Santiago", activo: true },
    { id: 3, nombre: "Carlos López", email: "carlos@empresa.com", departamento: "IT", salario: 48000, ciudad: "La Vega", activo: true },
    { id: 4, nombre: "Ana Martínez", email: "ana@empresa.com", departamento: "Marketing", salario: 55000, ciudad: "Santo Domingo", activo: false },
    { id: 5, nombre: "Pedro Rodríguez", email: "pedro@empresa.com", departamento: "RRHH", salario: 50000, ciudad: "San Pedro", activo: true },
    { id: 6, nombre: "Laura Fernández", email: "laura@empresa.com", departamento: "IT", salario: 68000, ciudad: "Santo Domingo", activo: true },
    { id: 7, nombre: "Miguel Sánchez", email: "miguel@empresa.com", departamento: "Ventas", salario: 47000, ciudad: "Santiago", activo: true },
    { id: 8, nombre: "Isabel Torres", email: "isabel@empresa.com", departamento: "Marketing", salario: 53000, ciudad: "La Vega", activo: true },
    { id: 9, nombre: "Roberto Gómez", email: "roberto@empresa.com", departamento: "Desarrollo", salario: 72000, ciudad: "Santo Domingo", activo: true },
    { id: 10, nombre: "Carmen Díaz", email: "carmen@empresa.com", departamento: "QA", salario: 58000, ciudad: "Santiago", activo: false },
  ],
  enableSort: true,
  language: "es" as const,
};

gridie.setConfig(config);
document.getElementById("dataTable")?.appendChild(gridie);
`;

export const jsCode = `import { Gridie } from './gridie';

const gridie = document.createElement("gridie-table");

// Simular valores desde "BD" para Ciudad
const ciudadesDesdeDB = ["Santo Domingo", "Santiago", "La Vega", "San Pedro"];

const config = {
  id: "tabla-header-filter",
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
          showCount: false,
        },
      },
    },
    {
      label: "Email",
      type: "string",
      filters: {
        headerFilter: {
          visible: true,
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
              text: "🖥️ Técnicos",
              operator: "in",
              value: ["IT", "Desarrollo", "QA"],
            },
            {
              text: "💼 Negocio",
              operator: "in",
              value: ["Ventas", "Marketing", "RRHH"],
            },
          ],
          values: ["IT", "Ventas", "Marketing", "RRHH", "Desarrollo", "QA", "Finanzas"],
        },
      },
    },
    {
      label: "Salario",
      type: "number",
      sortable: true,
      filters: {
        filterRow: {
          visible: true,
        },
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
      },
    },
    {
      label: "Ciudad",
      type: "string",
      filters: {
        headerFilter: {
          visible: true,
          values: ciudadesDesdeDB,
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
      },
    },
  ],
  body: [
    { id: 1, nombre: "Juan Pérez", email: "juan@empresa.com", departamento: "IT", salario: 45000, ciudad: "Santo Domingo", activo: true },
    { id: 2, nombre: "María García", email: "maria@empresa.com", departamento: "Ventas", salario: 52000, ciudad: "Santiago", activo: true },
    { id: 3, nombre: "Carlos López", email: "carlos@empresa.com", departamento: "IT", salario: 48000, ciudad: "La Vega", activo: true },
    { id: 4, nombre: "Ana Martínez", email: "ana@empresa.com", departamento: "Marketing", salario: 55000, ciudad: "Santo Domingo", activo: false },
    { id: 5, nombre: "Pedro Rodríguez", email: "pedro@empresa.com", departamento: "RRHH", salario: 50000, ciudad: "San Pedro", activo: true },
    { id: 6, nombre: "Laura Fernández", email: "laura@empresa.com", departamento: "IT", salario: 68000, ciudad: "Santo Domingo", activo: true },
    { id: 7, nombre: "Miguel Sánchez", email: "miguel@empresa.com", departamento: "Ventas", salario: 47000, ciudad: "Santiago", activo: true },
    { id: 8, nombre: "Isabel Torres", email: "isabel@empresa.com", departamento: "Marketing", salario: 53000, ciudad: "La Vega", activo: true },
    { id: 9, nombre: "Roberto Gómez", email: "roberto@empresa.com", departamento: "Desarrollo", salario: 72000, ciudad: "Santo Domingo", activo: true },
    { id: 10, nombre: "Carmen Díaz", email: "carmen@empresa.com", departamento: "QA", salario: 58000, ciudad: "Santiago", activo: false },
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
  <title>Gridie - Header Filter Demo</title>
</head>
<body>
  <h1>Gridie Header Filter - Casos de Uso Completos</h1>
  <div id="dataTable"></div>

  <script type="module" src="./index.js"></script>
</body>
</html>
`;